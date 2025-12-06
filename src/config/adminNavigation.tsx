import { DotIcon, RequestIcon } from "@/assets/icons";
import { AdminIcon } from "@/assets/icons/AdminIcon";
import { GlobalOutlined, MobileOutlined } from "@ant-design/icons";

export const AdminSystem = (admin: any) => {
  const menu = admin
    ? [
        {
          key: "/learning-management",
          label: "Quản lý học tập",
          path: "/learning-management",
          icon: <AdminIcon color="white" size={20} />,
          children: [
            {
              key: "/learning-management/class",
              label: "Lớp học",
              path: "/learning-management/class",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/topics",
              label: "Chủ đề",
              path: "/learning-management/topics",
              icon: <DotIcon color="white" size={20} />,
              children: [
                {
                  key: "/learning-management/topics/public",
                  label: "Chung",
                  path: "/learning-management/topics/public",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
                {
                  key: "/learning-management/topics/private",
                  label: "Riêng",
                  path: "/learning-management/topics/private",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
              ],
              hidden: false,
            },
            {
              key: "/learning-management/lesson",
              label: "Bài học",
              path: "/learning-management/lesson/public",
              icon: <DotIcon color="white" size={20} />,
              // children: [
              //   {
              //     key: "/learning-management/lesson/public",
              //     label: "Chung",
              //     path: "/learning-management/lesson/public",
              //     hidden: false,
              //     icon: <DotIcon color="white" size={20} />,
              //   },
              //   {
              //     key: "/learning-management/lesson/private",
              //     label: "Riêng",
              //     path: "/learning-management/lesson/private",
              //     hidden: false,
              //     icon: <DotIcon color="white" size={20} />,
              //   },
              // ],
              hidden: false,
            },
            {
              key: "/learning-management/part/public",
              label: "Phần",
              path: "/learning-management/part/public",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/vocabulary",
              label: "Từ điển học liệu",
              path: "/learning-management/vocabulary",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
              children: [
                {
                  key: "/learning-management/vocabulary/public",
                  label: "Chung",
                  path: "/learning-management/vocabulary/public",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
                {
                  key: "/learning-management/vocabulary/private",
                  label: "Riêng",
                  path: "/learning-management/vocabulary/private",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
              ],
            },
            {
              key: "/learning-management/questions",
              label: "Câu hỏi",
              path: "/learning-management/questions",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/check-list",
              label: "Bài kiểm tra ",
              path: "/learning-management/check-list",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
              children: [
                {
                  key: "/learning-management/check-list/public",
                  label: "Chung",
                  path: "/learning-management/check-list/public",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
                {
                  key: "/learning-management/check-list/private",
                  label: "Riêng",
                  path: "/learning-management/check-list/private",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
              ],
            },
            {
              key: "/learning-management/statistics",
              label: "Thống kê học tập",
              path: "/learning-management/statistics",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
          ],
          hidden: false,
        },

        {
          key: "/user-management",
          label: "Quản lý người dùng",
          path: "/user-management",
          icon: <AdminIcon color="white" size={20} />,
          children: [
            {
              key: "/user-management/teacher",
              label: "Giáo viên",
              path: "/user-management/teacher",
              hidden: !(admin?.role === "ADMIN"),
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/user-management/student",
              label: "Học sinh",
              path: "/user-management/student",
              icon: <DotIcon color="white" size={20} />,
            },
          ],
        },

        {
          key: "/approve-request",
          label: "Phê duyệt yêu cầu",
          path: "/approve-request",
          icon: <RequestIcon color="white" size={20} />,
          children: [
            {
              key: "/approve-request/data-collect",
              label: "Dữ liệu thu thập",
              path: "/approve-request/data-collect",
              hidden: !(admin?.role === "ADMIN"),
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/approve-request/account",
              label: "Tài khoản",
              path: "/approve-request/account",
              hidden: !(admin?.role === "ADMIN"),
              icon: <DotIcon color="white" size={20} />,
            },
          ],
          hidden: !(admin?.role === "ADMIN"),
        },
        {
          key: "/mobile",
          label: "Link file mobile",
          path: "/mobile",
          icon: <MobileOutlined color="white" size={20} />,
          hidden: !(admin?.role === "ADMIN"),
        },
        {
          key: "/introduction-management",
          label: "Giới thiệu",
          path: "/introduction-management",
          icon: <GlobalOutlined color="white" size={20} />,
          hidden: !(admin?.role === "ADMIN"),
        },
      ]
    : [];

  // Hàm đệ quy để lọc các mục có hidden = false và duyệt vào children
  const filterMenuItems = (items: any) => {
    return items?.reduce((acc: any, item: any) => {
      if (!item?.hidden) {
        const newItem = { ...item };
        if (newItem.children) {
          newItem.children = filterMenuItems(newItem?.children); // Đệ quy lọc các children
        }
        acc.push(newItem);
      }
      return acc;
    }, []);
  };

  const filteredMenu = filterMenuItems(menu);

  return filteredMenu;
};
