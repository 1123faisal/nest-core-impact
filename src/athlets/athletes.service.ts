import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Password } from 'src/common/password';
import { ExerciseCategory } from 'src/exercise_categories/entities/exercise_category.entity';
import { S3Provider } from 'src/providers/s3.provider';
import { PaginatedDto } from 'src/sports/dto/paginates.dto';
import { SportsService } from 'src/sports/sports.service';
import { Gender, Role } from 'src/users/entities/types';
import { User } from 'src/users/entities/user.entity';
import validator from 'validator';
import { CreateAthleteDto } from './dto/create-athlete.dto';
import { UpdateAthleteDto } from './dto/update-athlete.dto';

@Injectable()
export class AthletesService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ExerciseCategory.name)
    private readonly ExCategoryModel: Model<ExerciseCategory>,
    private readonly s3Provider: S3Provider,
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

  async addAthletesByFile(
    athletes: {
      category: string;
      name: string;
      email: string;
      phone: string;
      gender: string;
      avatar: string;
    }[],
  ) {
    const athletesWithHashedPasswords = await Promise.all(
      athletes.map(async (v) => {
        const normalPassword = Password.generateRandomPassword(8);
        return {
          ...v,
          password: await Password.hashPassword(normalPassword),
          normalPassword,
        };
      }),
    );

    let row = 1;

    let saveableAthletes: {
      role: string;
      name: string;
      email: string;
      mobile: string;
      gender: string;
      avatar: string;
      password: string;
    }[];

    for await (const athlete of athletesWithHashedPasswords) {
      if (athlete?.email) {
        if (!validator.isEmail(athlete.email)) {
          throw new BadRequestException(`invalid email ${athlete.email}`);
        }

        const user = await this.userModel.findOne({
          email: validator.normalizeEmail(athlete.email),
        });

        if (user) {
          throw new BadRequestException(
            `email already in use ${athlete.email}`,
          );
        }
      }

      if (athlete?.phone && !validator.isMobilePhone(athlete.phone)) {
        throw new BadRequestException(`invalid phone ${athlete.phone}`);
      }

      if (athlete?.avatar && !validator.isURL(athlete.avatar)) {
        throw new BadRequestException(`invalid avatar ${athlete.avatar}`);
      }

      if (athlete?.name && !validator.isLength(athlete.name, { min: 1 })) {
        throw new BadRequestException(`invalid name ${athlete.name}`);
      }

      if (
        athlete?.gender &&
        !validator.isIn(athlete.gender, [Gender.Female, Gender.Male])
      ) {
        throw new BadRequestException(
          `invalid gender ${athlete.gender} must be ${[
            Gender.Female,
            Gender.Male,
          ].join(',')}`,
        );
      }

      if (
        athlete?.category &&
        !validator.isIn(athlete?.category, [
          Role.College,
          Role.Elite,
          Role.Professional,
        ])
      ) {
        throw new BadRequestException(
          `invalid gender ${athlete.gender} must be ${[
            Role.Elite,
            Role.Professional,
          ].join(',')}`,
        );
      }
      row++;

      saveableAthletes.push({
        role: athlete.category,
        name: athlete.name,
        email: athlete.email,
        mobile: athlete.phone,
        gender: athlete.gender,
        avatar: athlete.avatar,
        password: athlete.password,
      });
    }

    await this.userModel.insertMany(saveableAthletes);

    return { inserted: row };
  }
}
