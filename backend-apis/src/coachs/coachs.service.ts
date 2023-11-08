import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { PaginatedDto } from 'src/common/dtos/paginates.dto';
import { CreateCoachDto } from './dto/create-coach.dto';
import { UpdateCoachDto } from './dto/update-coach.dto';
import { Coach } from './entities/coach.entity';
import { CoachSetting } from './entities/settings.entity';
import { CoachSettingDto } from './dto/coach-db-setting.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CoachsService {
  constructor(
    @InjectModel(Coach.name) private readonly coachModel: Model<Coach>,
    @InjectModel(CoachSetting.name)
    private readonly Setting: Model<CoachSetting>,
    private readonly s3Provider: S3Provider,
  ) {}

  private async uploadFile(file: Express.Multer.File | string) {
    if (typeof file === 'string') {
      return;
    }

    return await this.s3Provider.uploadFileToS3(file);
  }

  async create(createAthleteDto: CreateCoachDto) {
    if (createAthleteDto.avatar) {
      createAthleteDto.avatar = await this.uploadFile(createAthleteDto.avatar);
    }

    return await this.coachModel.create(createAthleteDto);
  }

  async findAll(skip?: number, limit?: number): Promise<PaginatedDto<Coach>> {
    return {
      results: await this.coachModel
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'athletes',
          select: 'name',
        }),
      total: await this.coachModel.countDocuments(),
    };
  }

  async findOne(id: string) {
    const user = await this.coachModel.findById(id);

    if (!user) {
      throw new NotFoundException('no user found.');
    }

    return user;
  }

  async update(id: string, updateAthleteDto: UpdateCoachDto) {
    const user = await this.findOne(id);

    const isDuplicateEmail = await this.coachModel.findOne({
      email: updateAthleteDto.email,
      _id: { $ne: id },
    });

    if (isDuplicateEmail) {
      throw new BadRequestException('This email already in use.');
    }

    if (updateAthleteDto.avatar) {
      updateAthleteDto.avatar = await this.uploadFile(updateAthleteDto.avatar);
    }

    return await this.coachModel.findByIdAndUpdate(user.id, updateAthleteDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.coachModel.findByIdAndDelete(id);
  }

  async doUnAssignAthlete(coachId: string, athleteIds: string[]) {
    await this.findOne(coachId);

    return await this.coachModel.findByIdAndUpdate(
      coachId,
      {
        $pull: { athletes: { $in: athleteIds } },
      },
      { new: true },
    );
  }

  async assignAthletes(athleteId: string, ...coaches: string[]) {
    const [physician_coach, batting_coach, trainer_coach, pitching_coach] =
      coaches;

    const uniqueCoaches = new Set(coaches);

    const count = await this.coachModel.countDocuments({
      _id: { $in: uniqueCoaches },
    });

    if (count == uniqueCoaches.size) {
      throw new BadRequestException('invalid coach ids detected');
    }

    return await this.coachModel.updateMany(
      {
        _id: {
          $in: coaches,
        },
      },
      {
        $addToSet: { athletes: athleteId },
      },
      { new: true },
    );
  }

  async getDashboardSetting(): Promise<CoachSetting> {
    let setting = await this.Setting.findOne();

    if (!setting) {
      setting = await this.Setting.create({});
    }

    return setting;
  }

  async updateDashboardSetting(
    orgSettingDto: CoachSettingDto,
  ): Promise<CoachSetting> {
    let setting = await this.Setting.findOne();

    if (!setting) {
      setting = await this.Setting.create({});
    }

    orgSettingDto.banner = await this.s3Provider.uploadFileToS3(
      orgSettingDto.banner,
    );
    orgSettingDto.logo = await this.s3Provider.uploadFileToS3(
      orgSettingDto.logo,
    );

    return await this.Setting.findOneAndUpdate({}, orgSettingDto, {
      new: true,
    });
  }

  async getAthletes(
    coachId: string,
    skip?: number,
    limit?: number,
  ): Promise<PaginatedDto<User>> {
    const coach = await this.findOne(coachId);

    const { athletes } = await coach.populate({
      path: 'athletes',
      populate: [
        {
          path: 'physician_coach',
          select: { name: 1 },
        },
        {
          path: 'batting_coach',
          select: { name: 1 },
        },
        {
          path: 'trainer_coach',
          select: { name: 1 },
        },
        {
          path: 'pitching_coach',
          select: { name: 1 },
        },
        {
          path: 'sport',
          select: { name: 1 },
        },
      ],
    });

    limit = limit || athletes.length;

    return {
      results: athletes.slice(skip, skip + limit),
      total: athletes.length,
    };
  }
}
