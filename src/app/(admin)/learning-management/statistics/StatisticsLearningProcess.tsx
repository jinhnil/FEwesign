"use client";
import { CloseIcon } from "@/assets/icons";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import { validateRequireInput } from "@/utils/validation/validtor";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, message, DatePicker, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useCallback, useState } from "react";
import { CustomTable } from "../check-list/ExamList";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import User from "@/model/User";
import Auth from "@/model/Auth";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface Student {
  name: string;
  classroom: any;
  classRoomId: number;
  studentProfile: any;
  classStudents: any;
  studentId: number;
}

const StatisticsLearningProcess: React.FC = () => {
  const user: User = useSelector((state: RootState) => state.admin);
  const router = useRouter();

  const [form] = useForm();
  const [lstStudents, setLstStudents] = useState<Student[]>([]);
  const [filteredLstStudents, setFilteredLstStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;
  const [modalCreate, setModalCreate] = useState<{
    open: boolean;
    typeModal: string;
  }>({
    open: false,
    typeModal: "create",
  });
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const navigateToStudentLearningProcess = (studentId: number) => {
    router.push(`/learning-management/statistics/${studentId}`);
  };

  // Fetching the list of classes
  const { data: allClasses, isFetching: isFetchingClasses } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClasses();
      return res.content.map((item: { name: string; classRoomId: number }) => ({
        label: item.name,
        value: Number(item.classRoomId),
      }));
    },
  });

  // Fetching the list of schools
  const { data: allSchools, isFetching: isFetchingSchools } = useQuery({
    queryKey: ["getListSchool"],
    queryFn: async () => {
      const res = await Learning.getListSchool();
      return res.content.map((item: { name: string; schoolId: number }) => ({
        label: item.name,
        value: Number(item.schoolId),
      }));
    },
  });

  // Fetching the list of students
  const [total, setTotal] = useState<number>(0);
  const { isFetching, refetch } = useQuery({
    queryKey: [
      "getListStudents",
      searchText,
      selectedClass,
      selectedSchool,
      currentPage,
    ],
    queryFn: async () => {
      const res = await User.studentList({
        userId: user.userId,
        name: searchText,
        classRoomId: selectedClass,
        schoolId: selectedSchool,
        page: currentPage - 1, // Thêm tham số page
        take: pageSize,
        orderBy: "userId",
        sortBy: "DESC",
      });
      setTotal(res.meta.itemCount);
      // Tạo lại dữ liệu với cấu trúc phù hợp
      const mappedData = res.content.map((item: any) => ({
        name: item.name,
        studentId: item.userId,
        classRoomId: item.classroomId || "Không có",
        classroom: item.classRoomName || "Không có",
        studentProfile: {
          // Giả sử các thông tin về học sinh, nếu có
          birthDay:
            item.birthDay && dayjs(item.birthDay).isValid()
              ? dayjs(item.birthDay).add(0, "day").format("YYYY-MM-DD")
              : "Không có",
          schoolName: item.schoolName || "Không có",
          address: item.city || "Không có",
          email: item.email || "Không có",
          phoneNumber: item.phoneNumber || "Không có",
        },
        classStudents: [item], // Mỗi bản ghi là một lớp học sinh tham gia
      }));

      // Cập nhật dữ liệu
      setLstStudents(mappedData);
      setFilteredLstStudents(mappedData);
      return mappedData;
    },
  });

  // Adding or editing a student
  const mutationCreateUpdate = useMutation({
    mutationFn: async (data: any) => {
      if (modalCreate.typeModal === "create") {
        // Call API to create a student
        return await User.createStudent(data);
      } else {
        // Call API to update a student
        // return await User.updateStudent(data);
        const { studentId, ...rest } = data;
        return await User.updateUser(studentId, rest);
      }
    },
    onSuccess: (res, variables) => {
      refetch();

      const updatedStudent = {
        ...variables,
        name: res.name,
        classroom: allClasses?.find(
          (cls: { value: any }) => cls.value === variables.classroom,
        )?.label,
        studentProfile: {
          schoolName: allSchools?.find(
            (sch: { value: any }) => sch.value === variables.school,
          )?.label,
          birthDay: variables.birthDay || "Không có",
          address: variables.address || "Không có",
          email: `${variables.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
          phoneNumber: variables.phoneNumber || "Không có",
        },
      };

      setLstStudents((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedStudent]
          : prevLst.map((student) =>
              student.studentId === res.userId ? updatedStudent : student,
            ),
      );
      setFilteredLstStudents((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedStudent]
          : prevLst.map((student) =>
              student.studentId === res.userId ? updatedStudent : student,
            ),
      );

      message.success(
        `${modalCreate.typeModal === "create" ? "Thêm mới học sinh thành công" : "Cập nhật học sinh thành công"}`,
      );

      setModalCreate({ ...modalCreate, open: false });
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error?.data?.message || "Đã xảy ra lỗi");
    },
  });

  const columns = [
    {
      title: "STT", // Index
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 50,
    },
    {
      title: "Tên", // Name
      dataIndex: "name",
      key: "name",
      render: (value: string) => <div className="text-lg">{value}</div>,
      // render: (value: string, record: Student) => (
      //   <div
      //     className="cursor-pointer text-lg text-blue-600 hover:underline"
      //     onClick={() => navigateToStudentLearningProcess(record.studentId)}
      //   >
      //     {value}
      //   </div>
      // ),
      width: 300,
    },
    // {
    //   title: "Ngày sinh", // Date of birth
    //   dataIndex: "studentProfile",
    //   key: "birthDay",
    //   render: (value: any) => (
    //     <div className="text-lg">{value?.birthDay || "Không có"}</div>
    //   ),
    //   width: 200,
    // },
    {
      title: "Lớp", // Class
      dataIndex: "classroom",
      key: "classroom",
      render: (value: string, record: Student) => (
        <div className="text-lg">
          {record?.classStudents?.length > 0 &&
            record?.classStudents[0]?.classRoomName}
        </div>
      ),
      width: 200,
    },
    {
      title: "Trường", // School
      dataIndex: "studentProfile",
      key: "schoolName",
      render: (value: any) => (
        <div className="text-lg">{value?.schoolName || "Không có"}</div>
      ),
      width: 200,
    },
    {
      title: "Sdt", // School
      dataIndex: "studentProfile",
      key: "phoneNumber",
      render: (value: any) => (
        <div className="text-lg">{value?.phoneNumber || "Không có"}</div>
      ),
      width: 200,
    },
    // {
    //   title: "Địa chỉ", // Address
    //   dataIndex: "studentProfile",
    //   key: "address",
    //   render: (value: any) => (
    //     <div className="text-lg">{value?.address || "Không có"}</div>
    //   ),
    //   width: 300,
    // },
    {
      title: "Email", // Email
      dataIndex: "studentProfile",
      key: "email",
      render: (value: any) => (
        <div className="text-lg">{value?.email || "Không có"}</div>
      ),
      width: 200,
    },
  ]?.filter((item) => item);

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      refetch();
    }, 300),
    [lstStudents],
  );

  const isLoading = isFetching || mutationCreateUpdate.isPending;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách học sinh</h1>
      <div className="mb-4 flex items-center justify-between">
        <InputPrimary
          allowClear
          onClear={() => {
            refetch();
            setCurrentPage(1);
            setSearchText("");
          }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            handleSearch(e.target.value);
          }}
          className="mb-4"
          style={{ width: 400 }}
          placeholder="Tìm kiếm tên học sinh"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.currentTarget.value);
            }
          }}
        />
        {/* Show filters only for ADMIN users */}
        {["ADMIN", "TEACHER"].includes(user?.role) && (
          <>
            <Select
              options={allClasses}
              placeholder="Lọc theo lớp"
              onChange={(value) => {
                setSelectedClass(value);
                setCurrentPage(1);
              }}
              allowClear
              style={{ width: 200 }}
              loading={isFetchingClasses}
            />
            <Select
              options={allSchools}
              placeholder="Lọc theo trường"
              onChange={(value) => {
                setSelectedSchool(value);
                setCurrentPage(1);
              }}
              allowClear
              style={{ width: 200 }}
              loading={isFetchingSchools}
            />
          </>
        )}
      </div>
      <CustomTable
        columns={columns as any}
        dataSource={filteredLstStudents}
        loading={isLoading}
        onRow={(record: any) => {
          return {
            onClick: () => {
              navigateToStudentLearningProcess(record.studentId);
            },
            className: "cursor-pointer hover:bg-gray-50", // Thêm style gợi ý có thể nhấp (optional)
          };
        }}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: total,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />
    </div>
  );
};

export default StatisticsLearningProcess;
