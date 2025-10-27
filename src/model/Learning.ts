/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";
import axios from "axios";

class Learning extends Base {

  constructor() {
    super("learning-service");
  }
  // Danh sách topic
  getAllTopics = async (params?: any) => {
    const res = await this.apiGet("/topics/all", params);
    return res.data;
  };

  // Topic chung
  getAllTopicsShared = async (classRoomId: number) => {
    const res = await this.apiGet(`/topics/all-common/${classRoomId}`);
    return res.data;
  };

  // Topic Riêng
  getAllTopicsPrivate = async (classRoomId: number) => {
    const res = await this.apiGet(`/topics/all-private/${classRoomId}`);
    return res.data;
  };

  // Tìm kiếm chủ đề
  searchTopics = async (params: any) => {
    const res = await this.apiGet("/topics/search/v2", params);
    return res.data;
  };

  // Thêm mới topics
  addTopics = async (body: any) => {
    const res = await this.apiPost("/topics", body);
    return res.data;
  };

  // Chỉnh sửa topics
  editTopics = async (body: any) => {
    const res = await this.apiPut("/topics", body);
    return res.data;
  };

  // Xoá chủ đề
  deleteTopics = async (id: any) => {
    const res = await this.apiDelete(`/topics/${id}`);
    return res.data;
  };

   // Danh sách từ vựng
  getAllVocabulary = async (param?: any) => {
  const res = await this.apiGet("/vocabularies/all", param);
  return res.data;
  };

  // CHi tiết từ vựng
  getDetailVocabularyById = async (id?: string) => {
    const res = await this.apiGet(`/vocabularies/get-by-id/${id}`);
    return res.data;
  };

  // Chi tiết nội dung media của từ
  getDetailVocabulary = async (id?: string) => {
    const res = await this.apiGet(`/vocabularies/${id}`);
    return res.data;
  };

  // Thêm từ vựng mới
  addVocabulary = async (body: any) => {
    const res = await this.apiPost("/vocabularies", body);
    return res.data;
  };

  // Thêm từ vựng vào topic
  addVocabularyTopic = async (body: any) => {
    const res = await this.apiPost(
      "/vocabularies/add-vocab-list-to-new-topic/v2",
      body,
    );
    return res.data;
  };

  // edit
  editVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabularies", body);
    return res.data;
  };

  // Thêm từ nhiều video, hình ảnh
  addLstVocabulary = async (body: any) => {
    const res = await this.apiPost("/vocabularies/add-list", body);
    return res.data;
  };

  // Xoá từ vựng
  deleteVocabulary = async (body: any) => {
    const res = await this.apiDeleteBody(`/vocabularies/delete-list`, body);
    return res.data;
  };

  // Danh sách từ vựng theo topics
  getVocabularyTopic = async (topicId: number | string, params?: any) => {
    const res = await this.apiGet(`/vocabularies/${topicId}`, params);
    return res.data;
  };

  // Tìm kiếm tử
  searchVocabulary = async (params: any) => {
    const res = await this.apiPost(`/vocabularies/search`, params);
    return res.data;
  };

  // Tìm kiếm theo bảng chữ cái
  getAlphabet = async (body: any) => {
    const res = await this.apiPost(`/vocabularies/get-by-content`, body);
    return res.data;
  };

  // Danh sách nội dung tình nguyện viền đăng
  getTableDataVolunteer = async (params: any) => {
    const res = await this.apiGet(`/data-collection/options-list-me`, params);
    return res.data;
  };

  // Danh sách nội dung cần phê duyệt
  getPendingData = async (params?: any) => {
    const res = await this.apiGet(
      `/data-collection/pending-list-admin`,
      params,
    );
    return res.data;
  };

  getOptionDataAdmin = async (params?: any) => {
    const res = await this.apiGet(
      `/data-collection/options-list-admin`,
      params,
    );
    return res.data;
  };

  // Thêm data tình nguyện viên đăng
  sendData = async (body: any) => {
    const res = await this.apiPost(`/data-collection`, body);
    return res.data;
  };

  // Sửa nội dung tnv đăng
  editData = async (body: any) => {
    const res = await this.apiPut(`/data-collection`, body);
    return res.data;
  };

  // Xoá nội dung tnv đăng
  deleteData = async (id: any) => {
    const res = await this.apiDelete(`/data-collection/${id}`);
    return res.data;
  };

  // reject nội dung
  rejectData = async (body: any) => {
    const res = await this.apiPost(`/data-collection/reject`, body);
    return res.data;
  };

  // duyệt nội dung
  approveData = async (body: any) => {
    const res = await this.apiPost(`/data-collection/approve`, body);
    return res.data;
  };

  //* CLass
  getListClass = async (params?: any) => {
    const res = await this.apiGet(`/classrooms/all`, params);
    return res.data;
  };

  getListClasses = async (params?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/class-list`, params);
    return res.data;
  };

  getListSchool = async (params?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/school-list`, params);
    return res.data;
  };

  getListSchools = async (params?: any) => {
    const res = await this.apiGet(`/schools/all`, params);
    return res.data;
  }
  
  // Thêm mới lớp
  createClass = async (body?: any) => {
    const res = await this.apiPost(`/classrooms`, body);
    return res.data;
  };

  // Chỉnh sửa mới lớp
  editClass = async (body?: any) => {
    const res = await this.apiPut(`/classrooms`, body);
    return res.data;
  };

  // Xoá  lớp
  deleteClass = async (id?: number) => {
    const res = await this.apiDelete(`/classrooms/${id}`);
    return res.data;
  };

  // Link mobile
  getLinkMobile = async (params?: any) => {
    const res = await this.apiGet(`/mobiles/all`, params);
    return res.data;
  };

  addLinkMobile = async (body?: any) => {
    const res = await this.apiPost(`/mobiles`, body);
    return res.data;
  };

  editLinkMobile = async (body?: any) => {
    const res = await this.apiPut(`/mobiles/${body?.id}`, {
      mobileLocation: body?.mobileLocation,
    });
    return res.data;
  };

  deleteLinkMobile = async (id?: number) => {
    const res = await this.apiDelete(`/mobiles/${id}`);
    return res.data;
  };

  // GIới thiệu
  addIntroduction = async (body?: any) => {
    const res = await this.apiPost(`/introductions`, body);
    return res.data;
  };

  editIntroduction = async (body?: any) => {
    const res = await this.apiPut(`/introductions`, body);
    return res.data;
  };

  getIntroduction = async () => {
    const res = await this.apiGet(`/introductions`);
    return res.data;
  };

  // part
  getPartAll = async (body?: any) => {
    const res = await this.apiGet(`/parts/all`, body);
    return res.data;
  };
  getPartDetail = async (body?: any) => {
    const res = await this.apiGet(`/parts`, body);
    return res.data;
  };
  addPart = async (body?: any) => {
    const res = await this.apiPost(`/parts`, body);
    return res.data;
  };
  addListPart = async (body?: any) => {
    const res = await this.apiPost(`/parts/sdd-list`, body);
    return res.data;
  };
  editPart = async (body?: any) => {
    const res = await this.apiPut(`/parts`, body);
    return res.data;
  };
  
  deletePart = async (id?: number) => {
    const res = await this.apiDelete(`/parts/${id}`);
    return res.data;
  };
  updatePart = async (partId: string, partData: any) => {
    const res = await this.apiPut(`/parts/${partId}`, partData);
    return res.data;
  };

  // New method to get the list of teachers
  getListTeachers = async (params?: any) => {
    const res = await this.apiGetNode(`/teachers/all`, params); // Adjust the endpoint as necessary
    return res.data;
  };

  // join student to class
  joinClass = async (body?: any) => {
    const res = await this.apiPostWithoutPrefixNode(
      `/classroom/join/${body?.classRoomId}`,
      body,
    );
    return res.data;
  };

  // leave student from class
  leaveClass = async (body?: any) => {
    const res = await this.apiPostWithoutPrefixNode(
      `/classroom-auth/leave/${body?.id}`,
      body,
    );
    return res.data;
  };

  leaningProcess = async (userId: number) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/statistics/${userId}`);
    return res.data.statistics;
  };

  getVocabularyViews = async (userId: number) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/vocabulary/recent-view/${userId}`);
    return res.data;
  };

  getLessonViews = async (userId: number) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/lesson/recent-view/${userId}`);
    return res.data;
  }; 

  getFullLessonViews = async (userId: number) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/lesson/full-view/${userId}`);
    return res.data;
  }; 

  getFullVocabularyViews = async (userId: number) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/vocabulary/full-view/${userId}`);
    return res.data;
  }; 

  getFullTestsCompleted = async (userId: number) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/test/full-view/${userId}`);
    return res.data;
  }; 

  getFullTestResults = async (query?: any) => {
    const res = await this.apiGetWithoutPrefixNode(`/user/test/full-result`, query);
    return res.data;
  }; 

  viewLesson = async (lessonId: number, userId: number) => {
  const res = await this.apiPostWithoutPrefixNode(
    `/user/lesson/view/${lessonId}`, {
    userId,  
  });
  return res.data;
};

  classJoined = async () => {
    // const res = await this.apiGetWithoutPrefix(`/user-auth/class-joined`);
    // return res.data;
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("User is not authenticated!");
    }

    // const res = await this.apiGetWithoutPrefixNode(`/user-auth/class-joined`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    const res = await this.apiGetWithoutPrefixNode(
      `/user/class-joined`,
      {}, // query
      undefined, // signal
      { Authorization: `Bearer ${token}` } // headers
    );
    return res.data;
  };

  updateStudentClass = async (body: any) => {
    const res = await this.apiPutWithoutPrefixNode(
      `/classroom/update-student-in-class/${body.userId}`,
      body,
    );
    return res.data;
  };
}

export default new Learning();

