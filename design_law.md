# Design Law — Customer Frontend

> Tài liệu này là quy ước thiết kế chung cho toàn bộ giao diện customer của dự án. Khi tạo page hoặc component mới, hãy ưu tiên tái sử dụng ngôn ngữ thị giác và token đã có trong `frontend-customer/public/css/style.css`, `coloring.css` và `colors/scheme-01.css`.

## 1. Tinh thần thương hiệu

- Cảm giác chính: boutique hotel cao cấp, yên tĩnh, ấm áp, tinh tế và giàu trải nghiệm.
- Ưu tiên khoảng thở, hình ảnh lớn, typography thanh lịch và chuyển động nhẹ.
- Tránh giao diện dày đặc, màu neon, gradient mạnh, card kiểu dashboard hoặc quá nhiều đường viền.
- Nội dung hướng đến trải nghiệm lưu trú: hình ảnh, phòng, tiện nghi, đánh giá và hành động đặt phòng phải được ưu tiên thị giác.
- Ngôn ngữ hiển thị mặc định trong customer frontend là tiếng Anh theo template hiện tại; nếu thêm bản dịch, không làm thay đổi hierarchy và độ dài tương đối của layout.

## 2. Design tokens

### Màu sắc

| Token | Giá trị hiện tại | Cách dùng |
| --- | --- | --- |
| `--primary-color` | `#AB8965` | Màu champagne/nâu vàng thương hiệu; CTA, active state, icon, accent, rating |
| `--primary-color-rgb` | `171, 137, 101` | Alpha background và overlay: `rgba(var(--primary-color-rgb), alpha)` |
| `--title-font-color` | `#181818` | Tiêu đề trên nền sáng |
| `--body-font-color` | `#606060` | Nội dung và mô tả |
| `--bg-dark-1` | `#181818` | Hero, footer, section tối |
| `--bg-dark-2` | `#232323` | Surface tối cấp hai |
| `--bg-dark-3` | `#303030` | Border/divider trên nền tối |
| `--bg-light` | `#FFF5ED` | Nền sáng ấm cho section/card |
| `--bg-grey` | `#F0F1F3` | Nền trung tính phụ |
| trắng | `#FFFFFF` | Card sáng, text trên nền tối |

Quy tắc màu:

- Không hard-code một màu accent mới nếu có thể dùng `var(--primary-color)`.
- CTA chính dùng nền `--primary-color`, text trắng; hover dùng transition nhẹ và vẫn giữ tương phản rõ.
- Nền sáng nên là trắng hoặc `--bg-light`; nền tối nên là `--bg-dark-1`.
- Text phụ không dùng màu quá nhạt trên nền sáng. Trên nền tối dùng trắng với opacity vừa phải, tương ứng `--dark-body-font-color: rgba(255,255,255,.6)`.
- Rating/star, active navigation, link hover và decorative line dùng primary color.

### Typography

CSS hiện tại khai báo các font stack sau:

- Tiêu đề: `"Marcellus", Helvetica, Arial, sans-serif` (`--title-font`)
- Nội dung/navigation: `"Jost", Helvetica, Arial, sans-serif` (`--body-font`, `--mainmenu-font`)
- Body: `16px`, weight `400`, line-height `1.7em`, màu `#606060`.
- Heading mặc định: weight `300`, tạo cảm giác thanh mảnh và sang trọng.

| Cấp | Size desktop | Line-height | Quy tắc |
| --- | ---: | ---: | --- |
| H1 / hero title | `64px` | `1.15em` | Chỉ một thông điệp chính mỗi màn hình hero |
| H2 / section title | `52px` | `1.2em` | Dùng cho tiêu đề section, thường căn giữa |
| H3 | `26px` | `1.5em` | Tên nhóm nội dung hoặc card lớn |
| H4 | `22px` | `1.6em` | Tên tiện nghi/card |
| H5 | `18px` | `1.6em` | Label hoặc heading phụ |
| H6 | `14px` | `1.6em` | Metadata nhỏ |
| Body | `16px` | `1.7em` | Đoạn mô tả dễ đọc |
| Navigation | `17px` | inherited | Jost, weight `400` |
| Eyebrow/subtitle | khoảng `14px` | inherited | Uppercase hoặc tracking rộng, dùng primary color |

Lưu ý: stylesheet hiện tại khai báo Marcellus/Jost nhưng không chứa file font tương ứng trong `public/fonts`; khi cần đảm bảo rendering đồng nhất giữa máy, hãy bổ sung font loading có kiểm soát thay vì tự ý đổi sang font khác.

## 3. Layout và spacing

- Dùng Bootstrap grid đang có; ưu tiên `.container`, `.row`, `.col-lg-*`, `.col-md-*` và gap `g-4`.
- Container chuẩn theo Bootstrap: tối đa khoảng `1140px` ở màn hình lớn, `1320px` từ `1400px` trở lên.
- Dùng spacing scale của Bootstrap (`1` đến `5`) và các utility hiện có (`p-4`, `mb-3`, `mb-4`, `spacer-30`, `spacer-single`, `spacer-double`) trước khi tạo giá trị mới.
- Section thường có padding dọc rộng; không dồn nhiều section sát nhau.
- Trang landing hiện dùng cấu trúc: header → hero → giới thiệu/đánh giá → quote/testimonial → phòng → reservation → facilities → social/gallery → footer.
- Những section nội dung có thể dùng `lines-deco` để giữ motif đường trang trí mảnh.
- Căn giữa được ưu tiên cho hero, section heading, testimonial; nội dung thông tin/form ưu tiên căn trái để dễ quét.
- Không để nội dung chạm mép viewport; mobile luôn có gutter an toàn.

## 4. Hình ảnh và icon

- Hình ảnh là thành phần chính của trải nghiệm, không phải trang trí phụ. Dùng ảnh phòng, tiện nghi và lifestyle có chất lượng cao, ánh sáng ấm, bố cục thoáng.
- Hero dùng ảnh nền full-bleed với lớp overlay tối để text trắng đọc rõ.
- Dùng `object-fit: cover` cho ảnh card/hero; không kéo méo ảnh.
- Giữ tỉ lệ và treatment nhất quán: card phòng dùng hình tròn/bo lớn theo motif hiện tại (`rounded-up-100`), ảnh editorial có thể dùng shape mask.
- Asset có sẵn nằm trong `frontend-customer/public/images/`: `slider`, `room`, `facilities`, `gallery-square`, `misc`, `form`, `icons`, `svg`.
- Icon tiện nghi ưu tiên asset SVG/PNG có sẵn hoặc icon font hiện tại (Icofont/Font Awesome). Không trộn nhiều style icon trong cùng một nhóm.
- Mọi ảnh có ý nghĩa phải có `alt` mô tả; ảnh nền chỉ dùng cho mục đích trang trí thì alt rỗng hoặc được loại khỏi accessibility tree.
- Logo sáng dùng trên header/hero tối; logo đen dùng khi header chuyển sang nền sáng sau scroll.

## 5. Component rules

### Header và navigation

- Header desktop trong suốt trên hero; khi scroll có thể chuyển sang nền tối/sáng và đổi logo tương ứng.
- Navigation dùng chữ Jost, khoảng cách rộng, active/hover dùng primary color.
- Luôn có một CTA “Reservation” nổi bật ở header.
- Mobile phải chuyển sang menu compact qua `#menu-btn`; không cố nhồi toàn bộ navigation desktop.

### Hero

- Hero là section tối, cao theo viewport, ảnh nền full-bleed và overlay.
- Nội dung hero gồm tối đa: eyebrow/rating, một H1, một đoạn teaser ngắn và một CTA chính.
- Text hero căn giữa; độ rộng đoạn mô tả nên giới hạn để không tạo dòng quá dài.
- Slider chỉ chuyển động nhẹ; không dùng autoplay quá nhanh hoặc hiệu ứng gây mất tập trung.

### Section heading

- Pattern chuẩn: subtitle/eyebrow primary color → H2 serif → mô tả ngắn nếu cần.
- Mỗi section chỉ có một heading chính.
- Heading section thường căn giữa, nhưng form và nội dung hướng dẫn có thể căn trái.

### Buttons và links

- CTA chính dùng class hiện tại `.btn-main`; kiểu ưu tiên là chữ rõ, nền primary, padding thoáng và không bo quá tròn.
- CTA phụ dùng `.btn-line`/border hoặc link text; không cạnh tranh thị giác với CTA chính.
- Không tạo nhiều hơn một CTA chính trong cùng một block nếu không có lý do UX rõ ràng.
- Button có trạng thái hover, focus, disabled; focus phải nhìn thấy được.
- Link không dùng underline mặc định trong phong cách marketing hiện tại, nhưng vẫn phải có affordance bằng màu, hover hoặc border.

### Cards

- Card phòng/tiện nghi ưu tiên ảnh lớn, text ngắn, metadata rõ và hover overlay nhẹ.
- Surface sáng dùng nền trắng, border mảnh `border-grey` hoặc shadow rất nhẹ; tránh shadow nặng.
- Card cùng một collection phải có chiều cao, padding và treatment nhất quán.
- Giá phòng là thông tin nổi bật; dùng serif/size lớn và primary/white tùy nền.

### Forms và reservation

- Form đặt phòng là luồng chuyển đổi quan trọng: label rõ, thứ tự field tự nhiên, nhóm thông tin theo bước/ý nghĩa.
- Input/select có border mảnh, nền sáng, padding đủ lớn và trạng thái focus rõ.
- Không chỉ dùng placeholder thay cho label.
- Lỗi validation hiển thị gần field, bằng text rõ ràng; không chỉ dựa vào màu đỏ.
- Submit dùng CTA chính và copy hành động cụ thể.

### Footer

- Footer dùng section tối, text sáng và accent primary.
- Chia nhóm rõ: địa chỉ, liên hệ, navigation/social; giữ mật độ thấp và khoảng cách thoáng.

## 6. Responsive behavior

- Breakpoint nền tảng theo Bootstrap: `576`, `768`, `992`, `1200`, `1400px`; các breakpoint đặc thù hiện tại còn có `830px`, `1090px`, `480px`, `360px`.
- Từ tablet trở xuống: giảm kích thước H1/H2, giảm padding section, xếp các cột thành một hoặc hai cột, thu gọn navigation.
- Trên mobile: ẩn các ảnh phụ không thiết yếu (`sm-hide`), giữ lại nội dung chính và CTA; không để hero text tràn viewport.
- Carousel phải có thể vuốt bằng touch và không làm mất nội dung khi JavaScript chưa sẵn sàng.
- Form trên mobile xếp dọc, input và button có vùng chạm tối thiểu khoảng `44px`.
- Kiểm tra tối thiểu ở `360px`, `768px`, `1024px` và `1440px` trước khi hoàn thành page.

## 7. Motion, interaction và accessibility

- Motion mang tính hỗ trợ: fade/scale nhẹ, hover overlay và carousel; không dùng animation liên tục cho nội dung quan trọng.
- Tôn trọng `prefers-reduced-motion`; khi bật, tắt/reduce autoplay, parallax và reveal animation.
- Mọi interactive element phải keyboard-accessible và có focus state.
- Đảm bảo contrast tối thiểu cho text, CTA và form; text trên ảnh luôn có overlay hoặc vùng nền đủ ổn định.
- Không truyền thông tin chỉ bằng màu sắc; trạng thái phải có text, icon hoặc pattern bổ sung.
- Dùng semantic HTML (`header`, `nav`, `main`, `section`, `footer`, heading order), label form và `aria-label` cho icon-only button.
- Icon decorative phải có `aria-hidden="true"`; icon button phải có tên truy cập được.

## 8. Quy ước React và cấu trúc code

Khi chuyển template sang React, giữ cấu trúc đã định trong `frontend-customer/src/README.md`:

```text
src/
  app/          # app setup và providers
  pages/        # page-level components
  components/   # reusable web-only UI
  app/api.js    # API wiring của customer app
```

- Tách component theo vai trò UI (`Header`, `Hero`, `SectionHeading`, `RoomCard`, `ReservationForm`, `Footer`), không copy nguyên một page thành component khổng lồ.
- Dữ liệu lặp như room/facility/menu nên là array và render bằng map; markup, spacing và visual treatment giữ trong component dùng chung.
- API, auth và business logic dùng chung phải nằm trong `../../packages/shared`; không đặt `window`, `document`, DOM CSS code hoặc `localStorage` vào shared package.
- Không tạo CSS inline cho token thương hiệu nếu có thể dùng class/token chung.
- Khi thêm token mới, cập nhật tài liệu này và stylesheet nguồn; không tạo biến trùng nghĩa.
- Giữ asset path tương thích với `public/`; tránh import asset từ đường dẫn tuyệt đối phụ thuộc máy local.
- Chỉ dùng animation/plugin cũ của template khi cần; không để logic UI phụ thuộc ngầm vào jQuery hoặc script global trong page React.

## 9. Những điều không nên làm

- Không đổi primary color tùy ý theo từng page.
- Không dùng font sans-serif cho heading chính nếu không có quyết định brand mới.
- Không dùng quá nhiều màu accent, gradient, shadow hoặc border radius khác nhau.
- Không đặt text dài lên ảnh mà thiếu overlay.
- Không bỏ qua mobile vì layout desktop hiện tại dùng nhiều carousel và ảnh lớn.
- Không dùng heading sai thứ tự để đạt kích thước chữ; dùng class/token typography.
- Không đặt CTA chính ở nhiều vị trí với wording khác nhau cho cùng một hành động.
- Không thêm một thư viện icon mới nếu icon font/asset hiện tại đáp ứng được.

## 10. Checklist trước khi merge

- [ ] Page dùng đúng token màu và typography.
- [ ] Có hierarchy rõ: một H1, các H2 theo section, heading không nhảy cấp.
- [ ] Header, CTA Reservation, spacing và footer nhất quán với landing page.
- [ ] Ảnh dùng đúng asset/tỉ lệ, có alt phù hợp và không bị méo.
- [ ] Responsive đã kiểm tra ở mobile, tablet và desktop.
- [ ] Hover, focus, disabled, loading và error state đã được xử lý.
- [ ] Có keyboard navigation, label form và contrast đủ rõ.
- [ ] Animation nhẹ, không gây khó chịu và tôn trọng reduced motion.
- [ ] Component React được tái sử dụng; không copy-paste markup lặp.
- [ ] Nếu thay đổi token hoặc pattern, đã cập nhật lại `design_law.md`.

## 11. Nguồn tham chiếu hiện tại

- Markup mẫu: `frontend-customer/index.html`
- Token và layout chính: `frontend-customer/public/css/style.css`
- Mapping màu thương hiệu: `frontend-customer/public/css/coloring.css`, `frontend-customer/public/css/colors/scheme-01.css`
- Grid/utilities: `frontend-customer/public/css/bootstrap.min.css`
- Asset thương hiệu: `frontend-customer/public/images/`
- Quy ước chuyển sang React: `frontend-customer/src/README.md`

## 12. Staff operations dashboard

Staff frontend tham khảo bố cục quản trị của `design_template/React-Acara-v1.3-28-Feb-2023`, nhưng đã map về nghiệp vụ Aurelia Hotel và giữ visual language của customer frontend.

- Shell chuẩn: sidebar trái cố định → topbar có breadcrumb/profile → vùng nội dung có max-width và nhiều khoảng thở.
- Sidebar dùng surface trắng, border mảnh, active item có nền champagne rất nhạt và vạch primary ở cạnh trái; không dùng sidebar tối nặng.
- Topbar giữ sạch và ít nhiễu: notification, danh tính người dùng, vai trò và breadcrumb là các thông tin ưu tiên.
- Dashboard chỉ hiển thị operational snapshot: arrivals, occupancy, rooms available, open tasks; không thêm KPI giả nếu chưa có dữ liệu backend.
- Card thống kê có icon nhỏ, giá trị lớn, một dòng context/status; mỗi tone phụ chỉ dùng cho nhóm nghĩa: gold = brand, teal = positive, blue = information, rose = attention.
- Data panel dùng nền trắng, border `--line`, shadow rất nhẹ. Heading panel theo pattern eyebrow primary → title serif → action phụ.
- Bảng staff phải hỗ trợ tối thiểu: tìm kiếm theo tên/email/vai trò, lọc trạng thái, xem role/department, edit và activate/suspend.
- Trạng thái dùng text + pill, không chỉ dùng màu: `Active`, `Pending`, `Suspended`.
- Modal account dùng label thật, field cao tối thiểu `44px`, focus ring primary và action rõ ràng: Cancel / Send invitation hoặc Save changes.
- Mobile: sidebar biến thành drawer, topbar có nút menu, bảng giảm cột phụ nhưng vẫn giữ tên, vai trò và action chính.
- Khi API staff CRUD chưa sẵn sàng, UI phải hiển thị rõ trạng thái demo/local state; không tạo cảm giác thay đổi đã được lưu server.
- Không dùng icon Unicode làm icon chức năng trong dashboard; ưu tiên SVG inline nhất quán, có `aria-hidden` cho icon trang trí và accessible label cho icon button.
- Staff accounts có các lựa chọn con được thụt vào trong sidebar như `Danh sách`, `Phân quyền`, `Nhật ký truy cập`. Bám pattern Acara: các mục con là text list gọn, không dùng card, pill, rail hoặc container nền riêng; active state chỉ đổi màu/weight.
- Navigation và CTA theo role/permission phải được ẩn khi người dùng không có quyền. Dashboard yêu cầu role `ADMIN` + `DASHBOARD_VIEW`; Staff accounts yêu cầu role `ADMIN` + `ROLE_MANAGE_ROLES`. Client-side guard chỉ là UX—mọi API thực tế vẫn phải được backend kiểm soát quyền.
