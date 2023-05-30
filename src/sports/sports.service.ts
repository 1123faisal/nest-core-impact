import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { CreateSportDto } from './dto/create-sport.dto';
import { GetAllSportQueryParamDto } from './dto/get-all-sport-query.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { Sport } from './entities/sport.entity';
import { PaginatedDto } from './dto/paginates.dto';

@Injectable()
export class SportsService {
  constructor(
    @InjectModel(Sport.name) private readonly sportModel: Model<Sport>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createSportDto: CreateSportDto, userId: string) {
    const sport = await this.sportModel.findOneAndReplace(
      { user: userId },
      {
        name: createSportDto.name,
        handedType: createSportDto.handedType,
        batType: createSportDto.batType,
        kineticMovement: createSportDto.kineticMovement,
        batSpec: createSportDto.batSpec,
        staticMovement: createSportDto.staticMovement,
        user: userId,
      },
      {
        new: true,
        upsert: true,
      },
    );

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { sport: sport.id } },
    );

    return sport;
  }

  async findAll(
    getAllSportQueryParamDto: GetAllSportQueryParamDto,
  ): Promise<PaginatedDto<Sport>> {
    const result = await this.sportModel
      .find()
      .skip((getAllSportQueryParamDto.page - 1) * 10)
      .limit(getAllSportQueryParamDto.limit);

    const total = await this.sportModel.countDocuments();

    return { result, total };
  }

  async findOne(id: string) {
    const sport = await this.sportModel.findById(id);

    if (!sport) {
      throw new NotFoundException();
    }

    return sport;
  }

  async update(id: string, updateSportDto: UpdateSportDto) {
    const updatedSport = await this.sportModel.findByIdAndUpdate(
      id,
      updateSportDto,
      { new: true },
    );

    if (!updatedSport) {
      throw new NotFoundException();
    }

    return updatedSport;
  }

  async remove(id: string) {
    const deletedSport = await this.sportModel.findByIdAndRemove(id);

    if (!deletedSport) {
      throw new NotFoundException();
    }

    await this.userModel.findByIdAndUpdate(deletedSport.user, {
      sport: undefined,
    });
  }
}
