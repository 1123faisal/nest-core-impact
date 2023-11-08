import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Provider } from 'src/providers/s3.provider';
import { PaginatedDto } from 'src/common/dtos/paginates.dto';
import { User } from 'src/users/entities/user.entity';
import { Admin } from './entities/admin.entity';
import { AdminSetting } from './entities/settings.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminSettingDto } from './dto/admin-db-setting.dto';
import { CoachSetting } from 'src/coachs/entities/settings.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(AdminSetting.name)
    private readonly Setting: Model<AdminSetting>,
    private readonly s3Provider: S3Provider,
  ) {}

  private async uploadFile(file: Express.Multer.File | string) {
    if (typeof file === 'string') {
      return;
    }

    return await this.s3Provider.uploadFileToS3(file);
  }

  async create(createAthleteDto: CreateAdminDto) {
    if (createAthleteDto.avatar) {
      createAthleteDto.avatar = await this.uploadFile(createAthleteDto.avatar);
    }

    return await this.adminModel.create(createAthleteDto);
  }

  async findAll(skip?: number, limit?: number): Promise<PaginatedDto<Admin>> {
    return {
      results: await this.adminModel
        .find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      total: await this.adminModel.countDocuments(),
    };
  }

  async unassignCoaches(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      $set: {
        physician_coach: null,
        batting_coach: null,
        trainer_coach: null,
        pitching_coach: null,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.adminModel.findById(id);

    if (!user) {
      throw new NotFoundException('no user found.');
    }

    return user;
  }

  async update(id: string, updateAthleteDto: UpdateAdminDto) {
    const user = await this.findOne(id);

    const isDuplicateEmail = await this.adminModel.findOne({
      email: updateAthleteDto.email,
      _id: { $ne: id },
    });

    if (isDuplicateEmail) {
      throw new BadRequestException('This email already in use.');
    }

    if (updateAthleteDto.avatar) {
      updateAthleteDto.avatar = await this.uploadFile(updateAthleteDto.avatar);
    }

    return await this.adminModel.findByIdAndUpdate(user.id, updateAthleteDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.adminModel.findByIdAndDelete(id);
  }

  async doUnAssignAthlete(coachId: string, athleteIds: string[]) {
    await this.findOne(coachId);

    return await this.adminModel.findByIdAndUpdate(
      coachId,
      {
        $pull: { athletes: { $in: athleteIds } },
      },
      { new: true },
    );
  }

  async getDashboardSetting(): Promise<AdminSetting> {
    let setting = await this.Setting.findOne();

    if (!setting) {
      setting = await this.Setting.create({});
    }

    return setting;
  }

  async updateDashboardSetting(
    orgSettingDto: AdminSettingDto,
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
}
