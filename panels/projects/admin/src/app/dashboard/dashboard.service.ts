import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Athlete } from '../models/athlete.model';
import { Coach } from '../models/coach.model';
import { Setting } from '../models/setting.model';
import { PaginatedResponse } from '../models/paginated.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getProfile() {
    return this.http.get<User>(`${environment.apiUri}/api/v1/admins/profile`);
  }

  updateProfile(name: string, email: string, mobile: string, avatar?: Blob) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);

    if (avatar) {
      formData.append('avatar', avatar);
    }

    return this.http.post<User>(
      `${environment.apiUri}/api/v1/admins/update-profile`,
      formData
    );
  }

  changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    return this.http.post(
      `${environment.apiUri}/api/v1/admins/change-password`,
      { oldPassword, newPassword, confirmPassword }
    );
  }

  addAthletes(
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    const form = new FormData();

    if (avatar) {
      form.append('avatar', avatar);
    }

    form.append('name', name);
    form.append('gender', gender);
    form.append('email', email);
    form.append('mobile', mobile);

    return this.http.post(`${environment.apiUri}/api/v1/athletes`, form);
  }

  updateAthletes(
    id: string,
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    const form = new FormData();

    if (avatar) {
      form.append('avatar', avatar);
    }

    form.append('name', name);
    form.append('gender', gender);
    form.append('email', email);
    form.append('mobile', mobile);

    return this.http.patch(`${environment.apiUri}/api/v1/athletes/${id}`, form);
  }

  updateAthletesStatus(id: string, status: boolean) {
    const form = new FormData();

    form.append('status', JSON.stringify(status));

    return this.http.patch(`${environment.apiUri}/api/v1/athletes/${id}`, form);
  }

  deleteAthlete(id: string) {
    return this.http.delete(`${environment.apiUri}/api/v1/athletes/${id}`);
  }

  getAthlete(id: string) {
    return this.http.get<Athlete>(
      `${environment.apiUri}/api/v1/athletes/${id}`
    );
  }

  getAthletes(skip?: number, limit?: number) {
    return this.http.get<PaginatedResponse<Athlete>>(
      `${environment.apiUri}/api/v1/athletes`,
      {
        params: {
          skip: skip || 0,
          limit: limit || 0,
        },
      }
    );
  }

  addCoach(
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    const form = new FormData();

    if (avatar) {
      form.append('avatar', avatar);
    }

    form.append('name', name);
    form.append('gender', gender);
    form.append('email', email);
    form.append('mobile', mobile);

    return this.http.post(`${environment.apiUri}/api/v1/coachs`, form);
  }

  updateCoach(
    id: string,
    name: string,
    gender: string,
    email: string,
    mobile: string,
    avatar?: Blob
  ) {
    const form = new FormData();

    if (avatar) {
      form.append('avatar', avatar);
    }

    form.append('name', name);
    form.append('gender', gender);
    form.append('email', email);
    form.append('mobile', mobile);

    return this.http.patch(`${environment.apiUri}/api/v1/coachs/${id}`, form);
  }

  updateCoachStatus(id: string, status: boolean) {
    const form = new FormData();

    form.append('status', JSON.stringify(status));

    return this.http.patch(`${environment.apiUri}/api/v1/coachs/${id}`, form);
  }

  deleteCoach(id: string) {
    return this.http.delete(`${environment.apiUri}/api/v1/coachs/${id}`);
  }

  getCoach(id: string) {
    return this.http.get<Coach>(`${environment.apiUri}/api/v1/coachs/${id}`);
  }

  getCoaches(skip?: number, limit?: number) {
    return this.http.get<PaginatedResponse<Coach>>(
      `${environment.apiUri}/api/v1/coachs`,
      {
        params: {
          skip: skip || 0,
          limit: limit || 0,
        },
      }
    );
  }

  updateDashboardSetting(logo?: File, banner?: File) {
    const form = new FormData();

    if (logo) {
      form.append('logo', logo);
    }

    if (banner) {
      form.append('banner', banner);
    }

    return this.http.patch<Setting>(
      `${environment.apiUri}/api/v1/admins/update-db-settings`,
      form
    );
  }

  getDashboardSetting() {
    return this.http.get<Setting>(
      `${environment.apiUri}/api/v1/admins/db-settings`
    );
  }

  assignCoach(
    physician_coach: string,
    batting_coach: string,
    trainer_coach: string,
    pitching_coach: string,
    athleteId: string
  ) {
    return this.http.post(`${environment.apiUri}/api/v1/admins/assign-coach`, {
      athleteId,
      physician_coach,
      batting_coach,
      trainer_coach,
      pitching_coach,
    });
  }

  getImg(
    uri: string | null,
    width?: number,
    height?: number
  ): SafeResourceUrl | undefined {
    if (!uri) {
      console.log('uri not found');
      return;
    }

    let url = `${environment.apiUri}/api/v1/image?uri=${uri}`;

    if (height) url = `${url}&height=${height}`;
    if (width) url = `${url}&width=${width}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  createCategory(name: string, subCategories: string[]) {
    return this.http.post(`${environment.apiUri}/api/v1/exercise-categories`, {
      name,
      subCategories,
    });
  }

  updateCategory(id: string, name: string, subCategories: string[]) {
    return this.http.patch(
      `${environment.apiUri}/api/v1/exercise-categories/${id}`,
      { name, subCategories }
    );
  }

  updateCategoryStatus(id: string, status: boolean) {
    return this.http.patch(
      `${environment.apiUri}/api/v1/exercise-categories/${id}`,
      { status }
    );
  }

  getCategories(isParent = true, parentId?: string) {
    const params: Record<string, any> = { isParent };

    if (parentId) params['parentId'] = parentId;

    return this.http.get<Category[]>(
      `${environment.apiUri}/api/v1/exercise-categories`,
      { params }
    );
  }

  getCategory(id: string) {
    return this.http.get<Category>(
      `${environment.apiUri}/api/v1/exercise-categories/${id}`
    );
  }

  deleteCategory(id: string) {
    return this.http.delete(
      `${environment.apiUri}/api/v1/exercise-categories/${id}`
    );
  }

  createSubCategory(name: string, categoryId: string) {
    return this.http.post(
      `${environment.apiUri}/api/v1/exercise-categories/sub`,
      { name, categoryId }
    );
  }

  updateSubCategory(id: string, name: string) {
    return this.http.patch(
      `${environment.apiUri}/api/v1/exercise-categories/${id}`,
      { name }
    );
  }
}
