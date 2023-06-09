import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { User } from 'src/users/entities/user.entity';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';
import { CoachsService } from 'src/coachs/coachs.service';
import { SportsService } from 'src/sports/sports.service';
import { PaginatedDto } from 'src/sports/dto/paginates.dto';

@Injectable()
export class AthletesService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly s3Provider: S3Provider,
    private readonly coachService: CoachsService,
    private readonly sportService: SportsService,
  ) {}

  async create(createAthleteDto: CreateAthleteDto) {
    if (createAthleteDto.avatar) {
      createAthleteDto.avatar = await this.s3Provider.uploadFileToS3(
        createAthleteDto.avatar,
      );
    }

    return await this.userModel.create(createAthleteDto);
  }

  async findAll(skip?: number, limit?: number): Promise<PaginatedDto<User>> {
    return {
      results: await this.userModel
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'physician_coach',
          select: { name: 1 },
        })
        .populate({
          path: 'batting_coach',
          select: { name: 1 },
        })
        .populate({
          path: 'trainer_coach',
          select: { name: 1 },
        })
        .populate({
          path: 'pitching_coach',
          select: { name: 1 },
        })
        .populate({
          path: 'sport',
          select: { name: 1 },
        }),
      total: await this.userModel.countDocuments(),
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('no user found.');
    }

    return user;
  }

  async update(id: string, updateAthleteDto: UpdateAthleteDto) {
    const user = await this.findOne(id);

    const isDuplicateEmail = await this.userModel.findOne({
      email: updateAthleteDto.email,
      _id: { $ne: id },
    });

    if (isDuplicateEmail) {
      throw new BadRequestException('This email already in use.');
    }

    updateAthleteDto.avatar = await this.s3Provider.uploadFileToS3(
      updateAthleteDto.avatar,
    );

    return await this.userModel.findByIdAndUpdate(user.id, updateAthleteDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    // delete sport of this user
    this.sportService.remove(user.sport as any);

    // remove this user from coach

    return await this.userModel.findByIdAndDelete(id);
  }

  async assignCoach(athleteId: string, ...coaches: string[]) {
    await this.findOne(athleteId);
    const [physician_coach, batting_coach, trainer_coach, pitching_coach] =
      coaches;

    return await this.userModel.findByIdAndUpdate(
      athleteId,
      { physician_coach, batting_coach, trainer_coach, pitching_coach },
      { new: true },
    );
  }
}
