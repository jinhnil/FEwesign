"use client";
import { CustomTable } from "@/app/(admin)/learning-management/check-list/ExamList";
import { getNumberFromContent } from "@/app/(admin)/learning-management/class/ClassList";
import StudyComponent from "@/components/Study/StudyComponent";
import { default as Learning } from "@/model/Learning";
import Lesson from "@/model/Lesson";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Image,
  Input,
  List,
  Modal,
  Select,
  Skeleton,
  Spin,
  message,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export interface SectionHero2Props {
  className?: string;
}
interface Hero2DataType {
  headingImg?: string;
  image: string;
  heading: string;
  subHeading: string;
  btnText: string;
}
const { Option } = Select;

const Rooms: FC<SectionHero2Props> = ({ className = "" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = Number(searchParams.get("topicId"));
  const user: User = useSelector((state: RootState) => state.admin);

  const [showModal, setShowModal] = useState<{
    open: boolean;
    topicId: number;
    classRoomId: number;
    classRoomName?: string;
    isPrivate?: string;
  }>({
    open: false,
    topicId: 0,
    classRoomId: 0,
    classRoomName: "",
    isPrivate: "false",
  });

  const [searchText, setSearchText] = useState<string>("");
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [lstVocabulary, setLstVocabulary] = useState<any[]>([]);
  const [filteredClass, setFilteredClass] = useState<any[]>([]);
  const [lstClass, setLstClass] = useState<any[]>([]);

  const { data: allCLass, isFetching: isFetchingClass } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      res.data?.sort((a: { content: string }, b: { content: any }) => {
        const numA = getNumberFromContent(a.content);
        const numB = getNumberFromContent(b.content);

        if (numA !== null && numB !== null) {
          return numA - numB;
        } else if (numA !== null) {
          return -1;
        } else if (numB !== null) {
          return 1;
        } else {
          return a.content.localeCompare(b.content);
        }
      });
      setLstClass(res?.data);
      setFilteredClass(res?.data);
      return res.data?.map(
        (e: { content: any; classRoomId: any; imageLocation: string }) => ({
          label: e.content,
          value: e.classRoomId,
          imageLocation: e.imageLocation,
        }),
      );
    },
  });

  // API lấy danh sách bài học
  const { data: allLesson, isFetching } = useQuery({
    queryKey: ["getLstLessonByClass", showModal],
    queryFn: async () => {
      const res = await Lesson.getLstLessonByClass({
        classRoomId: showModal.classRoomId,
      });
      if (!res.data?.length) {
        const className = allCLass?.find(
          (item: { value: any }) => item.value === showModal.classRoomId,
        )?.label;
        message.error(`Không có bài học theo lớp ${className} `);
        setLstVocabulary([]);
        return [];
      }
      return res.data;
    },
    enabled: !!showModal.classRoomId,
  });

  //console.log("allLesson", allLesson);

  // API lấy danh sách từ theo topics
  const { data: allVocabulary, isFetching: isFetchingVocabulary } = useQuery({
    queryKey: ["getVocabularyTopic", showModal.topicId, showModal.isPrivate],
    queryFn: async () => {
      const res = await Learning.getVocabularyTopic(showModal.topicId);
      if (!res.data?.length) {
        message.error(`Không có từng vựng theo chủ đề đã chọn `);
        setLstVocabulary([]);

        return;
      }
      res?.data?.forEach(
        (item: {
          vocabularyImageResList: any[];
          vocabularyVideoResList: any[];
        }) => {
          item.vocabularyImageResList?.sort(
            (a: { primary: any }, b: { primary: any }) => {
              // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
              return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
            },
          );
          item.vocabularyVideoResList?.sort(
            (a: { primary: any }, b: { primary: any }) => {
              // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
              return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
            },
          );
        },
      );
      setLstVocabulary(res.data);
      return (res.data as Vocabulary[]) || [];
    },
    enabled: !!showModal.topicId && !!allLesson?.length,
  });

  // Tìm kiếm
  useEffect(() => {
    if (allLesson) {
      setFilteredTopics(
        allLesson.filter((item: any) =>
          item?.lessonName?.toLowerCase().includes(searchText.toLowerCase()),
        ),
      );
    }
  }, [searchText, allLesson]);

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 80,
    },
    {
      title: "Tên lớp học",
      dataIndex: "content",
      key: "content",
      render: (value: string, record: any) => (
        <div
          className="text-lg text-blue-700 hover:cursor-pointer"
          onClick={() => {
            router.push(`/study/lessonslist/?classRoomId=${record.classRoomId}`);
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Minh họa",
      dataIndex: "imageLocation",
      key: "image",
      render: (text: string) => (
        <>
          {text ? (
            <Image src={text} alt="" />
          ) : (
            <div className="">Không có ảnh minh hoạ</div>
          )}
        </>
      ),
      width: 200,
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (value: string) => <div className="text-lg">{value}</div>,
    },
  ];

  return (
    <Spin spinning={isFetchingVocabulary}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Select
            className="w-1/4"
            placeholder="Lựa chọn lớp học"
            size="large"
            allowClear
            onClear={() => {
              setFilteredClass(lstClass);
              setLstVocabulary([]);
            }}
            loading={isFetchingClass}
            onSelect={(value) => {
              setFilteredClass(
                lstClass?.filter((item) => item.classRoomId === value),
              );
              setLstVocabulary([]);
            }}
            optionLabelProp="label"
          >
            {allCLass?.map((item: any) => (
              <Option key={item.value} value={item.value} label={item.label}>
                <div className="">
                  <Avatar
                    size={40}
                    src={item.imageLocation}
                    alt={item.label}
                    className=""
                  />
                  <span className="ml-2">{item.label}</span>
                </div>
              </Option>
            ))}
          </Select>

          {(user?.role === "ADMIN" || user?.role === "TEACHER") && (
            <Select
              size="large"
              className="w-1/4"
              allowClear
              placeholder="Loại bài kiểm tra"
              defaultValue={"false"}
              options={[
                {
                  label: "Chung",
                  value: "false",
                },
                {
                  label: "Riêng",
                  value: "true",
                },
              ]}
              onChange={(value, option: any) => {
                setShowModal({
                  ...showModal,
                  isPrivate: value,
                });
                setLstVocabulary([]);
              }}
            />
          )}
        </div>

        {/* {allLesson?.length ? (
          <ButtonSecondary
            disabled={isFetching}
            className="mb-4 w-1/4 border border-solid border-neutral-700"
            onClick={() => setShowModal({ ...showModal, open: true })}
          >
            Lựa chọn chủ đề
          </ButtonSecondary>
        ) : null} */}
        {lstVocabulary?.length ? (
          <StudyComponent allVocabulary={lstVocabulary} />
        ) : (
          <CustomTable
            columns={columns as any}
            dataSource={filteredClass}
            pagination={{ pageSize: 100 }}
            scroll={{ y: 800 }}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        width={700}
        title={`Danh sách bài học - ${showModal.classRoomName}`}
        open={showModal.open}
        centered
        footer={null}
        onCancel={() => setShowModal({ ...showModal, open: false })}
      >
        <Input
          size="large"
          placeholder="Nhập bài học muốn tìm kiếm"
          className="w-2/3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <List
          className="custom-scrollbar mt-4 max-h-[450px] overflow-y-auto pb-4"
          loading={isFetching}
          itemLayout="horizontal"
          dataSource={filteredTopics}
          bordered
          renderItem={(lesson) => (
            <List.Item
              className={`${showModal.topicId === lesson.lessonId ? "bg-green-200" : ""} hover:cursor-pointer hover:bg-neutral-300`}
              onClick={() => {
                router.push(
                  `/study/lessons/?classRoomId=${showModal.classRoomId}&&lessonId=${lesson.lessonId}`,
                );
              }}
            >
              <Skeleton avatar title={false} loading={isFetching} active>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      className="mt-1"
                      size={50}
                      src={lesson?.imageLocation}
                    />
                  }
                  title={
                    <div className="mt-3 text-base font-semibold">
                      {lesson?.lessonName}
                    </div>
                  }
                />
              </Skeleton>
            </List.Item>
          )}
          locale={{ emptyText: "Không có kết quả tìm kiếm" }}
        />
      </Modal>
    </Spin>
  );
};

export default Rooms;
