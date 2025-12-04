import { Simulation, SubjectType, UserProfile } from './types';
import { Atom, Zap, FlaskConical, Dna, Globe, Calculator } from 'lucide-react';

export const SUBJECT_CONFIGS = {
  [SubjectType.PHYSICS]: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Zap, label: 'Vật lý' },
  [SubjectType.CHEMISTRY]: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: FlaskConical, label: 'Hóa học' },
  [SubjectType.BIOLOGY]: { color: 'bg-green-100 text-green-700 border-green-200', icon: Dna, label: 'Sinh học' },
  [SubjectType.EARTH_SCIENCE]: { color: 'bg-teal-100 text-teal-700 border-teal-200', icon: Globe, label: 'Địa lý' },
  [SubjectType.MATH]: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Calculator, label: 'Toán' },
  [SubjectType.ALL]: { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Atom, label: 'Tất cả' },
};

export const MOCK_USER: UserProfile = {
  id: "mock_user_001",
  username: "minhkhoa_pro",
  name: "Minh Khoa",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  streakDays: 5,
  xp: 1250,
  level: 4,
  isStreakFrozen: false
};

export const MOCK_SIMULATIONS: Simulation[] = [
  {
    id: '1',
    title: 'Mạch điện Lắp ráp',
    description: 'Xây dựng mạch điện với pin, bóng đèn, điện trở và công tắc. Quan sát dòng điện chạy qua.',
    subject: SubjectType.PHYSICS,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=400',
    popularity: 5,
    isNew: true,
    masteryLevel: 80
  },
  {
    id: '2',
    title: 'Cân bằng Hóa học',
    description: 'Học cách cân bằng các phương trình hóa học thông qua các ví dụ trực quan.',
    subject: SubjectType.CHEMISTRY,
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400',
    popularity: 4.8,
    masteryLevel: 30
  },
  {
    id: '3',
    title: 'Chọn lọc Tự nhiên',
    description: 'Khám phá cách các đặc điểm di truyền thay đổi qua nhiều thế hệ thỏ.',
    subject: SubjectType.BIOLOGY,
    thumbnailUrl: 'https://images.unsplash.com/photo-1589923188900-a6e8df82db2b?auto=format&fit=crop&q=80&w=400',
    popularity: 4.9,
    masteryLevel: 0
  },
  {
    id: '4',
    title: 'Chuyển động Ném xiên',
    description: 'Bắn một quả pháo, quả bóng golf và tìm hiểu về các vector vận tốc.',
    subject: SubjectType.PHYSICS,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&q=80&w=400',
    popularity: 5,
    masteryLevel: 100
  },
  {
    id: '5',
    title: 'Thang đo pH',
    description: 'Kiểm tra độ pH của các dung dịch hằng ngày như cà phê, xà phòng và nước.',
    subject: SubjectType.CHEMISTRY,
    thumbnailUrl: 'https://images.unsplash.com/photo-1603126857599-f6e1b70d4c18?auto=format&fit=crop&q=80&w=400',
    popularity: 4.5,
    masteryLevel: 0
  },
  {
    id: '6',
    title: 'Kiến tạo mảng',
    description: 'Mô phỏng sự di chuyển của vỏ trái đất và sự hình thành núi lửa.',
    subject: SubjectType.EARTH_SCIENCE,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518182170546-0766ac6f5a14?auto=format&fit=crop&q=80&w=400',
    popularity: 4.2,
    masteryLevel: 0
  },
  {
    id: '7',
    title: 'Đồ thị Hàm số',
    description: 'Khám phá sự thay đổi của đồ thị khi thay đổi các tham số m, x, c.',
    subject: SubjectType.MATH,
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400',
    popularity: 4.0,
    masteryLevel: 10
  },
  {
    id: '8',
    title: 'Cấu tạo Nguyên tử',
    description: 'Xây dựng nguyên tử từ proton, neutron và electron.',
    subject: SubjectType.CHEMISTRY,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=400',
    popularity: 5,
    isNew: true,
    masteryLevel: 0
  }
];