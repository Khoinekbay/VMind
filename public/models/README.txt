Thư mục này dành cho các asset 3D chung. Với chế độ xây cầu,
hệ thống đã kèm sẵn model mẫu `bridge-models/custom_bridge.gltf`.
Nếu bạn thay bằng mô hình riêng, đặt file vào `public/bridge-models`
và cập nhật hằng số `DEFAULT_MODEL_PATH` trong
`components/Physics/Bridge3D/BridgeModel.tsx` cho phù hợp.

File nên ở định dạng GLB/GLTF để react-three-fiber có thể nạp được.
