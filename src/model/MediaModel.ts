/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class MediaModel extends Base {
  constructor(){  
    super("learning-service");
  }
  // sét primary
  setPrimaryVideoVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-videos/set-primary", body);
    return res.data;
  };

  setPrimaryImageVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-images/set-primary", body);
    return res.data;
  };

  updateVideoVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-videos", body);
    return res.data;
  };

  updateImageVocabulary = async (body: any) => {
    const res = await this.apiPut("/vocabulary-images", body);
    return res.data;
  };

  deleteVideoVocabulary = async (id: any) => {
    const res = await this.apiDelete(`vocabulary-videos/${id}`);
    return res.data;
  };

  deleteImageVocabulary = async (id: any) => {
    const res = await this.apiDelete(`vocabulary-images/${id}`);
    return res.data;
  };

  // Thêm media
  addListImageVocabulary = async (body: any) => {
    const res = await this.apiPost("/vocabulary-images/add-list", body);
    return res.data;
  };

  addListVideoVocabulary = async (body: any) => {
    const res = await this.apiPost("/vocabulary-videos/add-list", body);
    return res.data;
  };

  postImagePart = async (body: any) => {
    const res = await this.apiPost("/part-images/add-list", body);
    return res.data;
  };

  postVideoPart = async (body: any) => {
    const res = await this.apiPost("/part-videos/add-list", body);
    return res.data;
  };

  updateVideoPart = async (body: any) => {
    const res = await this.apiPut("/part-videos", body);
    return res.data;
  };

  updateImagePart = async (body: any) => {
    const res = await this.apiPut("/part-images", body);
    return res.data;
  };

  deleteVideoPart = async (id: any) => {
    const res = await this.apiDelete(`part-videos/${id}`);
    return res.data;
  };

  deleteImagePart = async (id: any) => {
    const res = await this.apiDelete(`part-images/${id}`);
    return res.data;
  };
}

export default new MediaModel();
