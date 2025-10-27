/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class Questions extends Base {
  constructor() {
    super("learning-service");
  }
  // Danh sách câu hỏi
  getAllQuestion = async (params: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/question/all`, params);
    return res.data;
  };

  // danh sách câu hỏi theo topic
  getQuestionTopic = async (topicId: number) => {
    const res = await this.apiGet(`/questions/${topicId}`);
    return res.data;
  };

  // Chi tiết câu hỏi
  getDetailQuestion = async (questionId: string | number) => {
    const res = await this.apiGet(`/questions/detail/${questionId}`);
    return res.data;
  };

  // danh sách câu hỏi limit
  getLimitQuestionTopic = async (params?: any) => {
    const res = await this.apiGet(`/questions/limits-topic/v2`, params);
    return res.data;
  };

  getLstQuestionClass = async (classRoomId?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/question/class/${classRoomId}`);
    return res.data;
  };

  // danh sách câu hỏi theo lớp
  getLimitQuestionCLassRoom = async (params?: any) => {
    const res = await this.apiGet(`/questions/limits-classRoom/v2`, params);
    return res.data;
  };

  // Tạo câu hỏi
    addQuestionForExam = async (body?: any) => {
    const res = await this.apiPostWithoutPrefixNode(`/question/add-list`, body);
    return res.data;
  };

  // Sửa câu hỏi
  editQuestion = async (body?: any) => {
    const res = await this.apiPut(`/questions`, body);
    return res.data;
  };

  // Xoá câu bỏi
  deleteQuestion = async (body: { questionIds: number[] }) => {
    const res = await this.apiDeleteBodyNode(`/question/delete-list`, body);
    console.log('fe',res)
    return res.data;
  };

  // Dánh sách câu hỏi theo bài kiểm tra
  getLstQuestionExam = async (id?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/question/question-of-exam/${id}`);
    return res.data;
  };

  // Xoá đáp án
  deleteAnswer = async (id?: any) => {
    const res = await this.apiDelete(`/answers/${id}`);
    return res.data;
  };
}

export default new Questions();
