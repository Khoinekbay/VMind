Đặt file mô hình 3D của bạn cho chế độ xây cầu vào thư mục này.

Đã kèm sẵn một mẫu: `custom_bridge.gltf` (embedded buffer) để ứng dụng
tải được ngay. Nếu bạn thay thế bằng model riêng, cập nhật hằng số
`DEFAULT_MODEL_PATH` trong `components/Physics/Bridge3D/BridgeModel.tsx`
cho trùng với tên file.

Lưu ý: ưu tiên định dạng GLB/GLTF để đảm bảo react-three-fiber nạp được.
