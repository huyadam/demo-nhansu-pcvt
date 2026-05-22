"""
Export dữ liệu CBCNV từ Excel sang JSON để web app đọc.
Chạy: python export_data.py
"""
import pandas as pd
import json, sys, io, re
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

EXCEL_FILE = r'..\..\..\..\TCNS\Nhân sự\VT - Danh sách CBCNV.xlsx'

df = pd.read_excel(EXCEL_FILE)
print(f"Đọc {len(df)} CBCNV từ Excel")

records = []
for _, row in df.iterrows():
    rec = {
        'stt': int(row['Stt']) if pd.notna(row['Stt']) else 0,
        'msnv': str(row['MSNV']) if pd.notna(row['MSNV']) else '',
        'avatar': str(row['Link ảnh']) if pd.notna(row['Link ảnh']) else '',
        'hoTen': str(row['Họ và tên']).strip() if pd.notna(row['Họ và tên']) else '',
        'ngaySinh': row['Ngày sinh'].strftime('%Y-%m-%d') if pd.notna(row['Ngày sinh']) else '',
        'dienThoai': str(row['Điện thoại']) if pd.notna(row['Điện thoại']) else '',
        'email': str(row['Email']) if pd.notna(row['Email']) else '',
        'gioiTinh': str(row['Giới tính']) if pd.notna(row['Giới tính']) else '',
        'maPhongDoi': str(row['Mã Phòng Đội']) if pd.notna(row['Mã Phòng Đội']) else '',
        'phongDoiVietTat': str(row['Phòng Đội viết tắt']) if pd.notna(row['Phòng Đội viết tắt']) else '',
        'phongDoi': str(row['Phòng Đội']) if pd.notna(row['Phòng Đội']) else '',
        'toNhom': str(row['Phòng ban/Tổ nhóm']) if pd.notna(row['Phòng ban/Tổ nhóm']) else '',
        'maChucVu': int(row['Mã chức vụ']) if pd.notna(row['Mã chức vụ']) else 0,
        'chucVu': str(row['Chức vụ']) if pd.notna(row['Chức vụ']) else '',
        'trinhDo': str(row['Trình độ đào tạo']) if pd.notna(row['Trình độ đào tạo']) else '',
        'nganhNghe': str(row['Ngành nghề đào tạo']) if pd.notna(row['Ngành nghề đào tạo']) else '',
        'coSo': str(row['Cơ sở']) if pd.notna(row['Cơ sở']) else '',
        'coSoCu': str(row['Cơ sở cũ']) if pd.notna(row['Cơ sở cũ']) else '',
        'diaChiThuongTru': str(row['Địa chỉ thường trú']) if pd.notna(row['Địa chỉ thường trú']) else '',
        'khuVuc': str(row['Địa chỉ (khu vực)']) if pd.notna(row['Địa chỉ (khu vực)']) else '',
        'quaTrinhCongTac': str(row['Quá trình công tác']).replace('\\n', '\n').replace('\\r', '').replace('\\t', '  ') if pd.notna(row['Quá trình công tác']) else '',
        'dang': str(row['Đảng']) if pd.notna(row['Đảng']) else '',
        'congDoan': str(row['Công đoàn']) if pd.notna(row['Công đoàn']) else '',
    }
    records.append(rec)

output = {
    'exportDate': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
    'totalRecords': len(records),
    'data': records
}

with open('cbcnv_data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✓ Đã xuất {len(records)} CBCNV → cbcnv_data.json")
