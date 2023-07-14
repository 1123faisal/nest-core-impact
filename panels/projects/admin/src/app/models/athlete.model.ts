// Generated by https://quicktype.io

export interface Athlete {
  nickname: string;
  height: string;
  weight: string;
  heightIn: HeightIn;
  weightIn: string;
  country: string;
  state: string;
  zipCode: string;
  password: null | string;
  role: Role;
  otp: null | string;
  mobile: null | string;
  otpExpiration: null | string;
  sport: BattingCoach | null;
  physician_coach: BattingCoach | null;
  batting_coach: BattingCoach | null;
  trainer_coach: BattingCoach | null;
  pitching_coach: BattingCoach | null;
  _id: string;
  avatar: null | string;
  name: string;
  gender: Gender;
  email: string;
  profileCompleted: boolean;
  __v: number;
  coach?: string;
  status: boolean;
}

export interface BattingCoach {
  _id: string;
  name: string;
}

export enum Gender {
  Female = 'Female',
  Male = 'Male',
}

export enum HeightIn {
  CM = 'cm',
  Empty = '',
}

export enum Role {
  Elite = 'Elite',
  Professional = 'Professional',
}