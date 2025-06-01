// タスクの定義
export type TaskData = {
  id: string;
  content: string;
  chassis_number: string;
  remark?: string | null;
  comp_flg: number;
  completion?: string;
  wo_id: number;
  // 作業内容モデルオブジェクト
  work?: {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  ca_id: number;
  // 車種モデルオブジェクト
  car_model: {
    id: number;
    name: string;
    number: string;
    classes: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  co_id: number;
  // 色モデルオブジェクト
  color: {
    id: number;
    code: string;
    color_code: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  u_id: number;
  // ユーザモデル（作業者）のオブジェクト
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    group: number;
    created_at: string;
    updated_at: string;
  };
  admin_id: number;
  // ユーザモデル（管理者）のオブジェクト
  admin: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    group: number;
    created_at: string;
    updated_at: string;
  };
  name: string;
  code: string;
  admin_name: string;
  u_name: string;
  title: string;
};
