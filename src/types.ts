export interface InquiryItem {
  id: number;
  title: string;
  content: string;
  createTime: string;  // Date will be received as a string from API
  reply: string;
}