Đặt file mô hình 3D của bạn cho chế độ xây cầu vào thư mục này.
Ví dụ: copy `custom_bridge.glb` vào đây rồi giữ nguyên tên để hệ thống tự tải.
Nếu bạn đổi tên file, hãy cập nhật hằng số `DEFAULT_MODEL_PATH` trong
`components/Physics/Bridge3D/BridgeModel.tsx` cho trùng khớp.

Lưu ý: ưu tiên định dạng GLB/GLTF để đảm bảo react-three-fiber nạp được.
