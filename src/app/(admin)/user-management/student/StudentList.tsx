/* eslint-disable react-hooks/exhaustive-deps */
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
import { CustomTable } from "../../learning-management/check-list/ExamList";
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

const StudentList: React.FC = () => {
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
    router.push(`/student-learning-process/${studentId}`);
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

  //xác nhận xóa học sinh
  const handleDeleteStudent = (record: Student) => {
    Modal.confirm({
      title: "Xác nhận xoá học sinh",
      content: "Bạn có chắc chắn muốn xoá học sinh này không?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await User.deleteUser(record.studentId); // record.id là id của học sinh
          // Nếu thành công thì mới cập nhật lại danh sách ở FE
          setLstStudents((prev) =>
            prev.filter((student) => student.studentId !== record.studentId),
          );
          setFilteredLstStudents((prev) =>
            prev.filter((student) => student.studentId !== record.studentId),
          );

          message.success("Xóa học sinh thành công");
        } catch (error) {
          console.error(error);
          message.error("Xóa học sinh thất bại");
        }
      },
    });
  };

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
      // render: (value: string) => <div className="text-lg">{value}</div>,
      render: (value: string, record: Student) => (
        <div
          className="cursor-pointer text-lg text-blue-600 hover:underline"
          onClick={() => navigateToStudentLearningProcess(record.studentId)}
        >
          {value}
        </div>
      ),
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
    ["ADMIN", "TEACHER"].includes(user?.role)
      ? {
          title: "Hành động", // Actions
          key: "actions",
          render: (_: any, record: Student) => (
            <div className="flex space-x-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setCurrentStudentId(record.studentId);
                  const birthDay =
                    record.studentProfile.birthDay &&
                    record.studentProfile.birthDay !== "Không có"
                      ? dayjs(record.studentProfile.birthDay)
                      : null;

                  form.setFieldsValue({
                    name: record.name,
                    // classroom: record.classroom,
                    email: record.studentProfile.email || "",
                    phoneNumber: record.studentProfile.phoneNumber || "",
                    classroom: allClasses?.find(
                      (c: { label: any }) => c.label === record.classroom,
                    )?.value,
                    school:
                      record.studentProfile.schoolId ||
                      allSchools?.find(
                        (s: { label: any }) =>
                          s.label === record.studentProfile.schoolName,
                      )?.value,
                    birthDay: birthDay,
                    address: record.studentProfile.address,
                    studentId: record.studentId,
                  });
                  setModalCreate({
                    open: true,
                    typeModal: "edit",
                  });
                }}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={async () => handleDeleteStudent(record)}
              />
            </div>
          ),
        }
      : null,
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
        {user?.role === "ADMIN" && (
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

        <Button
          hidden={!(user?.role === "ADMIN" || user?.role === "TEACHER")}
          type="primary"
          style={{ background: "#2f54eb" }}
          icon={<PlusOutlined />}
          onClick={() => {
            setModalCreate({ ...modalCreate, open: true, typeModal: "create" });
            form.resetFields();
          }}
        >
          Thêm mới
        </Button>
      </div>
      <CustomTable
        columns={columns as any}
        dataSource={filteredLstStudents}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          total: total,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      {/* Thêm học sinh */}
      <BasicDrawer
        width={460}
        title={
          modalCreate.typeModal === "create"
            ? "Thêm mới học sinh"
            : "Chỉnh sửa học sinh"
        }
        onClose={() => {
          setModalCreate({ ...modalCreate, open: false });
          form.resetFields();
        }}
        open={modalCreate.open}
        destroyOnClose
        onOk={() => {
          form.submit();
        }}
        maskClosable={false}
        extra={
          <div className="flex items-center gap-x-4">
            <Button
              className="hover:opacity-60 "
              onClick={() => {
                setModalCreate({ ...modalCreate, open: false });
                form.resetFields();
              }}
              type="link"
              style={{ padding: 0 }}
            >
              <CloseIcon size={20} />
            </Button>
          </div>
        }
      >
        <div className="">
          <Form
            form={form}
            layout="vertical"
            onFinish={(value) => {
              mutationCreateUpdate.mutate({
                ...value,
                name: value.name,
                classroom: value.classroom,
                classRoomName:
                  allClasses?.find(
                    (cls: { value: number }) => cls.value === value.classroom,
                  )?.label || "",
                school: value.school,
                schoolName:
                  allSchools?.find(
                    (sch: { value: number }) => sch.value === value.school,
                  )?.label || "",
                studentId: currentStudentId,
                birthDay: value.birthDay
                  ? value.birthDay.format("YYYY-MM-DD")
                  : null,
                email: value.email,
                phoneNumber: value.phoneNumber,
              });
            }}
          >
            <Form.Item
              name="name"
              label="Tên học sinh"
              className="mb-2"
              required
              rules={[validateRequireInput("Tên học sinh không được bỏ trống")]}
            >
              <Input placeholder="Nhập tên học sinh" />
            </Form.Item>
            <Form.Item
              name="email"
              label="email"
              className="mb-2"
              required
              rules={[
                { required: true, message: "Email không được bỏ trống" },
                { type: "email", message: "Định dạng email không hợp lệ" },
              ]}
            >
              <Input placeholder="Nhập email của phụ huynh" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              className="mb-2"
              required
              rules={[
                validateRequireInput("Số điện thoại không được bỏ trống"),
                {
                  pattern: /^(0)[0-9]{9}$/,
                  message:
                    "Số điện thoại không hợp lệ (phải có 10 số và bắt đầu bằng 0)",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại Phụ huynh" />
            </Form.Item>
            <Form.Item
              name="school"
              label="Trường"
              className="mb-2"
              required
              rules={[validateRequireInput("Trường không được bỏ trống")]}
            >
              <Select
                options={allSchools || []}
                placeholder="Lựa chọn trường"
                loading={isFetchingSchools}
                allowClear
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            {/* lớp chỉ hiển thị sau khi chọn trường */}
            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev.school !== current.school}
            >
              {({ getFieldValue }) =>
                getFieldValue("school") ? (
                  <Form.Item
                    name="classroom"
                    label="Lớp"
                    className="mb-2"
                    required
                    rules={[
                      { required: true, message: "Lớp không được bỏ trống" },
                    ]}
                  >
                    <Select
                      options={allClasses || []}
                      placeholder="Lựa chọn lớp"
                      loading={isFetchingClasses}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            {/* <Form.Item
              name="birthDay"
              label="Ngày sinh"
              className="mb-2"
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              className="mb-2"
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item> */}
          </Form>
        </div>
      </BasicDrawer>
    </div>
  );
};

export default StudentList;
