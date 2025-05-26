// タスクの定義
export type TaskData = {
  id: string;
  title: string;
  content: string;
  name: string;
  color_code: string;
  chassis_number: string;
  wo_id?: number;
  ca_id?: number;
  u_id?: number;
  admin_id?: number;
  co_id?: number;
  remark?: string;
  admin_name?: string;
  u_name?: string;
  comp_flg?: number;
  completion?: string;
};
