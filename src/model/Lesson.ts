/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class Lesson extends Base {
  constructor() {
    super("learning-service");
  }
  // Danh sách bài học
  getLstLessonByClass = async (body?: any) => {
    const res = await this.apiGet("/lessons/all", body);
    return res.data;
  };

  // Tạo bài học
  createLesson = async (body?: any) => {
    return this.apiPost("/lessons", body);
  };

  // sửa bài học
  editLesson = async (body?: any) => {
    return this.apiPut("/lessons", body);
  };

  // Xoá bài học
  deleteLstLesson = async (id: any) => {
    return this.apiDelete(`/lessons/${id}`);
  };

  // Bài học theo lớp
  getLessonDetail = async (lessonsId?: number) => {
    return this.apiGet(`/lessons/${lessonsId}`);
  };
}

export default new Lesson();
