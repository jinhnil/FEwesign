"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Checkbox, Spin, message, Modal } from "antd";
import Exam from "@/model/Exam";
import { useParams, useRouter } from "next/navigation";

interface PracticeQuestion {
  contentFromVocabulary: string;
  videoUrl?: string;
  aiAnswer?: string;
}

const GradingTest: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId;
  const userId = params.userId;
  const [loading, setLoading] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState<
    PracticeQuestion[]
  >([]);
  const [visibleVideos, setVisibleVideos] = useState<{
    [key: number]: boolean;
  }>({});
  const [gradingList, setGradingList] = useState<
    { isCorrect: boolean | null }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | undefined>(
    undefined,
  );
  const VIDEO_BASE_URL = "http://202.191.56.11:8088/videos/";
  // const VIDEO_BASE_URL = "http://localhost:8088/videos/";
  // Lấy danh sách câu hỏi thực hành và kết quả AI detect
  useEffect(() => {
    if (!examId) return;
    setLoading(true);
    Exam.getDetailPracticeExamToScore(Number(examId), Number(userId))
      .then((res) => {
        const list = res?.data;
        if (Array.isArray(list)) {
          const filtered = list.filter(
            (q: any) => Array.isArray(q.videos) && q.videos.length > 0,
          );

          setPracticeQuestions(
            filtered.map((q: any) => ({
              contentFromVocabulary: q.contentFromVocabulary,
              videoUrl: q.videos[0]?.videoUrl || "", // lấy video đầu tiên (có thể cập nhật nếu nhiều video)
              aiAnswer: q.videos[0]?.aiAnswer || "",
            })),
          );

          setGradingList(filtered.map(() => ({ isCorrect: null })));
        } else {
          setPracticeQuestions([]);
          setGradingList([]);
        }
      })
      .catch(() => {
        message.error("Không lấy được danh sách câu hỏi thực hành");
      })
      .finally(() => setLoading(false));
  }, [examId, userId]);

  const toggleVideo = (index: number) => {
    setVisibleVideos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Hàm hiển thị modal video
  const showVideoModal = (videoUrl: string) => {
    setCurrentVideoUrl(VIDEO_BASE_URL + videoUrl);
    setIsModalVisible(true);
  };

  // Hàm đóng Modal
  const handleVideoModalClose = () => {
    // Quan trọng: Dừng video khi đóng modal
    setCurrentVideoUrl(undefined);
    setIsModalVisible(false);
  };

  // Hàm tick đúng/sai
  const handleGradeChange = (index: number, value: boolean) => {
    setGradingList((prev) => {
      const updated = [...prev];
      updated[index] = { isCorrect: value };
      return updated;
    });
  };

  // Hàm lưu kết quả chấm điểm
  const handleSaveGrading = async () => {
    const total = gradingList.length;
    const correct = gradingList.filter((g) => g.isCorrect === true).length;
    const score = total > 0 ? Math.round((correct / total) * 10 * 10) / 10 : 0; // Làm tròn 1 chữ số thập phân

    setLoading(true);
    try {
      // Gọi API lưu điểm và kết quả chấm từng câu
      // await Exam.saveGrading({
      await Exam.markPracticeExam({
        examId,
        userId,
        isFinished: true,
        // gradingList,
        score,
      });
      message.success(`Đã lưu kết quả chấm điểm! Điểm: ${score}/10`);
      router.push("/teacher-scoring-test");
    } catch (err) {
      message.error("Lưu kết quả thất bại");
    }
    setLoading(false);
  };

  //hủy và quay về trang trước
  const handleCancel = () => {
    router.push("/teacher-scoring-test");
  };

  // Cột bảng
  const columns = [
    {
      title: "Câu hỏi",
      dataIndex: "contentFromVocabulary",
      key: "contentFromVocabulary",
      width: 200,
    },
    {
      title: "Từ nhận diện",
      dataIndex: "aiAnswer",
      key: "aiAnswer",
      width: 200,
      render: (text: string) => <span>{text || <i>Chưa có</i>}</span>,
    },
    {
      title: "Video biểu diễn",
      dataIndex: "videoUrl",
      key: "videoUrl",
      width: 150,
      render: (videoUrl: string) =>
        videoUrl ? (
          <Button
            onClick={() => showVideoModal(videoUrl)}
            type="link"
            style={{ padding: 0 }}
          >
            Xem video
          </Button>
        ) : (
          <span>Chưa có</span>
        ),
    },
    {
      title: "Chấm điểm",
      key: "grading",
      width: 180,
      render: (_: any, record: any, idx: number) => (
        <div>
          <Checkbox
            checked={gradingList[idx]?.isCorrect === true}
            onChange={() => handleGradeChange(idx, true)}
            style={{ marginRight: 12 }}
          >
            Đúng
          </Checkbox>
          <Checkbox
            checked={gradingList[idx]?.isCorrect === false}
            onChange={() => handleGradeChange(idx, false)}
          >
            Sai
          </Checkbox>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="p-6">
        <h2 className="mb-4 text-xl font-bold">
          Chấm điểm bài kiểm tra thực hành
        </h2>
        <Table
          columns={columns}
          dataSource={practiceQuestions.map((q, idx) => ({
            ...q,
            key: idx,
          }))}
          pagination={false}
          bordered
        />
        <div className="mt-4 flex justify-end">
          <Button
            type="default"
            onClick={handleCancel}
            style={{ background: "#bebebeff", margin: "0 16px" }}
          >
            hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSaveGrading}
            style={{ background: "#2f54eb" }}
          >
            Lưu kết quả chấm điểm
          </Button>
        </div>
      </div>
      {/* Modal hiển thị video */}
      <Modal
        title="Video Biểu Diễn Của Học Sinh"
        open={isModalVisible} // Dùng 'open' thay cho 'visible' từ Antd v5
        onCancel={handleVideoModalClose}
        footer={null} // Ẩn footer
        width={700}
        centered
      >
        {currentVideoUrl && (
          <video
            controls
            autoPlay // Tự động phát khi mở
            width="100%"
            key={currentVideoUrl} // key giúp reset video khi URL thay đổi
          >
            <source src={currentVideoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        )}
      </Modal>
    </Spin>
  );
};

export default GradingTest;
