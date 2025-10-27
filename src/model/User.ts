/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class User extends Base {
  constructor() {
    super("user-service");
  }
  // thông tin cá nhân
  getProfile = async () => {
    const res = await this.apiGet("/users/me/v2");
    return res.data;
  };

  //Cập nhật thông tin cá nhân
  updateProfile = async (body: any) => {
    const res = await this.apiPut(`/users`, body);
    return res.data;
  };

  // Cập nhật avatar
  updateAvatar = async (body: any) => {
    const res = await this.apiUploadFile(`/users/upload-avatar`, body);
    return res.data;
  };

  // Thông tin người dùng chi tiết
  getUserInfo = async (id: number) => {
    const res = await this.apiGet(`/users/${id}`);
    return res.data;
  };

  // Thay đổi mật khẩu
  changePassword = async (body: any) => {
    const res = await this.apiPost(`/users/change-password`, body);
    return res.data;
  };

  // Tìm kiếm bạn bè
  searchFriend = async (param: any) => {
    const res = await this.apiGet(`/users/search/v2`, param);
    return res.data;
  };

  // Danh sách bạn bè
  getLstFriend = async (param?: any) => {
    const res = await this.apiGet(`/friend-ship/friend-list`, param);
    return res.data;
  };

  // Lời mời kết bạn
  getLstRequest = async (param?: any) => {
    const res = await this.apiGet(`/friend-ship/request-list`, param);
    return res.data;
  };

  // Lời mời đã gửi
  getLstSending = async (param?: any) => {
    const res = await this.apiGet(`/friend-ship/sending-list`, param);
    return res.data;
  };

  // Thêm bạn bè
  addFriend = async (userId: number) => {
    const res = await this.apiPost(`/friend-ship/add-friend/${userId}`, {
      userId,
    });
    return res.data;
  };

  // Đồng ý kết bạn
  acceptFriend = async (userId: number) => {
    const res = await this.apiPost(`/friend-ship/accept-friend/${userId}`, {});
    return res.data;
  };

  // Huỷ kết bạn, lời mời
  cancelFriend = async (userId: number) => {
    const res = await this.apiDelete(`/friend-ship/cancel-friend/${userId}`);
    return res.data;
  };

  // Danh sách tài khoản
  getAllAccount = async () => {
    const res = await this.apiGet(`/authorization/list-not-approved`);
    return res.data;
  };

  // Phê duyệt tài khoản
  approveAccount = async (id: number) => {
    const res = await this.apiPost(`/authorization/${id}`, { id: id });
    return res.data;
  };

  studentList = async (param?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/student-list`, param);
    return res.data;
  };

  allStudentList = async (param?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/all-student-list`, param);
    return res.data;
  };

  teacherList = async (param?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/teacher-list`, param);
    return res.data;
  };

    viewVocabulary = async (vocabularyId: number, userId: number) => {
    const res = await this.apiPostWithoutPrefixNode(
      `/user/vocabulary/view/${vocabularyId}`, {
      userId,  
    });
    return res.data;
  };
  
  updateUser = async (id: number, body: any) => {
    const res = await this.apiPutWithoutPrefixNode(`/user/${id}`, body);
    return res.data;
  };

  deleteUser = async (id: number) => {
    const res = await this.apiPutWithoutPrefixNode(`/user/delete/${id}`);
    return res.data;
  };

  createStudent = async (body: any) => {
    const res = await this.apiPostWithoutPrefixNode(`/user/create-student`, body);
    return res.data;
  };

  createTeacher = async (body: any) => {
    const res = await this.apiPostWithoutPrefixNode(`/user/create-teacher`, body);
    return res.data;
  };
}

export default  new User();
