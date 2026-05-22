/* ============================================
   PCVT — Engine Đánh giá Điều chuyển Nhân sự
   ============================================ */

// ============================================
// 1. CẤU HÌNH & DỮ LIỆU TĨNH
// ============================================

/** Ma trận khoảng cách giữa các Cơ sở (0-5) */
const DISTANCE_MATRIX = {
    'Cơ sở 1 (Vũng Tàu 1)': { 'Cơ sở 1 (Vũng Tàu 1)': 0, 'Cơ sở 2 (Vũng Tàu 2)': 1, 'Cơ sở 3 (Bà Rịa)': 2, 'Cơ sở 4 (Phú Mỹ)': 3, 'Cơ sở 5 (Côn Đảo)': 5 },
    'Cơ sở 2 (Vũng Tàu 2)': { 'Cơ sở 1 (Vũng Tàu 1)': 1, 'Cơ sở 2 (Vũng Tàu 2)': 0, 'Cơ sở 3 (Bà Rịa)': 2, 'Cơ sở 4 (Phú Mỹ)': 3, 'Cơ sở 5 (Côn Đảo)': 5 },
    'Cơ sở 3 (Bà Rịa)':     { 'Cơ sở 1 (Vũng Tàu 1)': 2, 'Cơ sở 2 (Vũng Tàu 2)': 2, 'Cơ sở 3 (Bà Rịa)': 0, 'Cơ sở 4 (Phú Mỹ)': 2, 'Cơ sở 5 (Côn Đảo)': 5 },
    'Cơ sở 4 (Phú Mỹ)':     { 'Cơ sở 1 (Vũng Tàu 1)': 3, 'Cơ sở 2 (Vũng Tàu 2)': 3, 'Cơ sở 3 (Bà Rịa)': 2, 'Cơ sở 4 (Phú Mỹ)': 0, 'Cơ sở 5 (Côn Đảo)': 5 },
    'Cơ sở 5 (Côn Đảo)':    { 'Cơ sở 1 (Vũng Tàu 1)': 5, 'Cơ sở 2 (Vũng Tàu 2)': 5, 'Cơ sở 3 (Bà Rịa)': 5, 'Cơ sở 4 (Phú Mỹ)': 5, 'Cơ sở 5 (Côn Đảo)': 0 }
};

/** Map khu vực lưu trú → Cơ sở gần nhất */
const KHUVU_TO_COSO = {
    'Vũng Tàu': 'Cơ sở 1 (Vũng Tàu 1)',
    'Bà Rịa': 'Cơ sở 3 (Bà Rịa)',
    'Côn Đảo': 'Cơ sở 5 (Côn Đảo)',
    'Phú Mỹ': 'Cơ sở 4 (Phú Mỹ)',
    'Tp. Hồ Chí Minh': 'Cơ sở 1 (Vũng Tàu 1)',
    'Khac': 'Cơ sở 1 (Vũng Tàu 1)'
};

/** Cơ sở chính của mỗi Phòng/Đội (dùng khi không chọn cơ sở đích) */
const PHONGDOI_COSO_DEFAULT = {
    'Ban Giám đốc': 'Cơ sở 1 (Vũng Tàu 1)',
    'Văn phòng': 'Cơ sở 1 (Vũng Tàu 1)',
    'Phòng Tổ chức và Nhân sự': 'Cơ sở 1 (Vũng Tàu 1)',
    'Phòng Kế hoạch và Vật tư': 'Cơ sở 1 (Vũng Tàu 1)',
    'Phòng Quản lý đầu tư': 'Cơ sở 1 (Vũng Tàu 1)',
    'Phòng Kỹ thuật và An toàn': 'Cơ sở 1 (Vũng Tàu 1)',
    'Phòng Kinh doanh': 'Cơ sở 1 (Vũng Tàu 1)',
    'Phòng Tài chính Kế toán': 'Cơ sở 1 (Vũng Tàu 1)',
    'Đội Vận hành lưới điện': 'Cơ sở 1 (Vũng Tàu 1)',
    'Đội Quản lý lưới điện': 'Cơ sở 1 (Vũng Tàu 1)',
    'Đội Dịch vụ khách hàng': 'Cơ sở 1 (Vũng Tàu 1)',
    'Đội Quản lý thu ghi': 'Cơ sở 1 (Vũng Tàu 1)',
    'Đội Quản lý hệ thống đo đếm': 'Cơ sở 1 (Vũng Tàu 1)',
    'Đội Quản lý Vận hành Tổng hợp Đặc khu Côn Đảo': 'Cơ sở 5 (Côn Đảo)'
};

/** Keyword kinh nghiệm liên quan cho mỗi đơn vị đích */
const EXPERIENCE_KEYWORDS = {
    'Ban Giám đốc': ['giám đốc', 'phó giám đốc', 'lãnh đạo', 'quản lý', 'điều hành'],
    'Văn phòng': ['văn phòng', 'hành chính', 'văn thư', 'lễ tân', 'công xa', 'lái xe', 'quản trị', 'tổng hợp'],
    'Phòng Tổ chức và Nhân sự': ['nhân sự', 'tổ chức', 'đào tạo', 'tiền lương', 'lao động', 'chế độ', 'chính sách', 'tuyển dụng'],
    'Phòng Kế hoạch và Vật tư': ['kế hoạch', 'vật tư', 'đấu thầu', 'mua sắm', 'cung ứng', 'khvt'],
    'Phòng Quản lý đầu tư': ['đầu tư', 'xây dựng', 'dự án', 'thiết kế', 'giám sát', 'thi công', 'công trình'],
    'Phòng Kỹ thuật và An toàn': ['kỹ thuật', 'an toàn', 'vận hành', 'sửa chữa', 'bảo trì', 'trạm biến áp', 'đường dây', 'ktat'],
    'Phòng Kinh doanh': ['kinh doanh', 'khách hàng', 'doanh thu', 'giá điện', 'hợp đồng', 'giao dịch', 'bán điện', 'dịch vụ'],
    'Phòng Tài chính Kế toán': ['tài chính', 'kế toán', 'ngân sách', 'thuế', 'hóa đơn', 'thanh toán', 'quyết toán', 'sổ sách'],
    'Đội Vận hành lưới điện': ['vận hành', 'lưới điện', 'trực ban', 'sự cố', 'trung thế', 'hạ thế', 'đóng cắt', 'trạm biến áp'],
    'Đội Quản lý lưới điện': ['quản lý lưới', 'lưới điện', 'đường dây', 'trạm biến áp', 'trung thế', 'hạ thế', 'sửa chữa', 'bảo trì'],
    'Đội Dịch vụ khách hàng': ['dịch vụ', 'khách hàng', 'giao dịch', 'tiếp nhận', 'giải quyết', 'đấu nối', 'hợp đồng'],
    'Đội Quản lý thu ghi': ['thu ghi', 'ghi điện', 'công tơ', 'chỉ số', 'cắt điện', 'thu tiền', 'nợ tiền'],
    'Đội Quản lý hệ thống đo đếm': ['đo đếm', 'công tơ', 'treo tháo', 'TBĐĐ', 'đo xa', 'giám sát', 'bảo trì', 'thiết bị đo'],
    'Đội Quản lý Vận hành Tổng hợp Đặc khu Côn Đảo': ['côn đảo', 'máy phát', 'diesel', 'hải đảo', 'phát điện', 'vận hành']
};

/** Ngành nghề ưu tiên cho mỗi đơn vị */
const MAJOR_PRIORITY = {
    'Ban Giám đốc': { high: ['quản trị', 'điện', 'kinh doanh'], related: ['kinh tế', 'luật'] },
    'Văn phòng': { high: ['hành chính', 'quản trị', 'lái xe', 'văn thư'], related: ['luật', 'kinh tế'] },
    'Phòng Tổ chức và Nhân sự': { high: ['quản trị', 'nhân sự', 'luật', 'kinh tế'], related: ['hành chính'] },
    'Phòng Kế hoạch và Vật tư': { high: ['kế hoạch', 'kinh tế', 'điện', 'quản trị'], related: ['vật tư', 'xây dựng'] },
    'Phòng Quản lý đầu tư': { high: ['xây dựng', 'điện', 'kiến trúc', 'đầu tư'], related: ['kế hoạch', 'kinh tế'] },
    'Phòng Kỹ thuật và An toàn': { high: ['điện', 'hệ thống điện', 'kỹ thuật điện', 'an toàn'], related: ['tự động hóa', 'điện tử'] },
    'Phòng Kinh doanh': { high: ['kinh doanh', 'kinh tế', 'điện', 'thương mại'], related: ['quản trị', 'marketing'] },
    'Phòng Tài chính Kế toán': { high: ['kế toán', 'tài chính', 'kiểm toán'], related: ['kinh tế', 'ngân hàng'] },
    'Đội Vận hành lưới điện': { high: ['điện', 'hệ thống điện', 'lưới điện', 'vận hành', 'cung cấp điện', 'điện công nghiệp'], related: ['sửa chữa', 'đường dây', 'trạm'] },
    'Đội Quản lý lưới điện': { high: ['điện', 'lưới điện', 'quản lý', 'sửa chữa', 'cung cấp điện', 'điện công nghiệp'], related: ['đường dây', 'trạm', 'vận hành'] },
    'Đội Dịch vụ khách hàng': { high: ['kinh doanh', 'dịch vụ', 'điện'], related: ['kinh tế', 'quản trị', 'thương mại'] },
    'Đội Quản lý thu ghi': { high: ['kinh doanh', 'điện', 'kinh tế'], related: ['kế toán', 'dịch vụ'] },
    'Đội Quản lý hệ thống đo đếm': { high: ['điện', 'đo lường', 'điện tử', 'tự động hóa', 'kỹ thuật điện'], related: ['lưới điện', 'vận hành', 'sửa chữa'] },
    'Đội Quản lý Vận hành Tổng hợp Đặc khu Côn Đảo': { high: ['điện', 'cơ khí', 'vận hành', 'diesel'], related: ['kinh doanh', 'kế toán', 'hành chính'] }
};

/** Trình độ yêu cầu: 'office' = phòng ban, 'field' = đội kỹ thuật */
const DEPT_TYPE = {
    'Ban Giám đốc': 'office',
    'Văn phòng': 'office',
    'Phòng Tổ chức và Nhân sự': 'office',
    'Phòng Kế hoạch và Vật tư': 'office',
    'Phòng Quản lý đầu tư': 'office',
    'Phòng Kỹ thuật và An toàn': 'office',
    'Phòng Kinh doanh': 'office',
    'Phòng Tài chính Kế toán': 'office',
    'Đội Vận hành lưới điện': 'field',
    'Đội Quản lý lưới điện': 'field',
    'Đội Dịch vụ khách hàng': 'mixed',
    'Đội Quản lý thu ghi': 'field',
    'Đội Quản lý hệ thống đo đếm': 'field',
    'Đội Quản lý Vận hành Tổng hợp Đặc khu Côn Đảo': 'field'
};

const EDUCATION_RANK = {
    'Tiến sĩ': 6, 'Thạc sĩ': 5, 'Đại học': 4, 'Cao đẳng': 3, 'Trung cấp': 2, 'Phổ thông': 1
};

/** Chuẩn hóa tên Phòng/Đội (gộp variant) */
const NAME_NORMALIZE = {
    'Phòng Kỹ Thuật và An toàn': 'Phòng Kỹ thuật và An toàn'
};

function normalizeName(name) {
    return NAME_NORMALIZE[name] || name;
}

// ============================================
// 2. STATE
// ============================================

let allData = [];
let lastResults = [];
let weights = {
    kinhNghiem: 30,
    nganhNghe: 25,
    khuVuc: 20,
    trinhDo: 10,
    thamNien: 10,
    dieuChuyen: 5
};

// ============================================
// 3. DATA LOADING
// ============================================

async function loadData() {
    try {
        const resp = await fetch('cbcnv_data.json');
        const json = await resp.json();
        // Normalize tên Phòng/Đội
        allData = json.data.map(d => ({ ...d, phongDoi: normalizeName(d.phongDoi) }));
        console.log(`Loaded ${allData.length} CBCNV (exported: ${json.exportDate})`);
        populateDropdowns();
        document.getElementById('filterStats').textContent = `📊 ${allData.length} CBCNV | Cập nhật: ${json.exportDate}`;
    } catch (err) {
        console.error('Lỗi load data:', err);
        document.getElementById('filterStats').textContent = '❌ Không tải được dữ liệu. Chạy export_data.py trước!';
    }
}

function populateDropdowns() {
    const units = [...new Set(allData.map(d => d.phongDoi))].sort();
    const tgtSelect = document.getElementById('selectTarget');
    const sourceOpts = document.getElementById('sourceOptions');

    units.forEach(u => {
        const count = allData.filter(d => d.phongDoi === u).length;
        // Target dropdown
        tgtSelect.add(new Option(`${u} (${count})`, u));
        // Source multi-select
        const label = document.createElement('label');
        label.className = 'ms-option';
        label.innerHTML = `<input type="checkbox" value="${u}"> ${u} <span class="ms-count">${count}</span>`;
        sourceOpts.appendChild(label);
    });
}

function getSelectedSources() {
    const checkboxes = document.querySelectorAll('#sourceOptions input[type=checkbox]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function updateSourceBtnText() {
    const selected = getSelectedSources();
    const btn = document.getElementById('sourceBtnText');
    if (selected.length === 0) {
        btn.textContent = '— Chọn đơn vị nguồn —';
    } else if (selected.length === 1) {
        btn.textContent = selected[0];
    } else {
        btn.textContent = `${selected.length} đơn vị đã chọn`;
    }
}

// ============================================
// 4. SCORING ENGINE
// ============================================

function scoreExperience(person, targetUnit) {
    const maxW = weights.kinhNghiem;
    if (maxW === 0) return { score: 0, detail: 'Bỏ qua', matchedKeywords: [], allKeywords: [] };

    const history = (person.quaTrinhCongTac || '').toLowerCase();
    const keywords = EXPERIENCE_KEYWORDS[targetUnit] || [];
    if (!keywords.length) return { score: 0, detail: 'Không có keyword', matchedKeywords: [], allKeywords: keywords };

    // Kiểm tra đã từng làm tại đơn vị đích
    const targetLower = targetUnit.toLowerCase();
    const directMatch = history.includes(targetLower);

    // Đếm keyword trùng
    let matchCount = 0;
    const matchedKw = [];
    const unmatchedKw = [];
    keywords.forEach(kw => {
        if (history.includes(kw.toLowerCase())) {
            matchCount++;
            matchedKw.push(kw);
        } else {
            unmatchedKw.push(kw);
        }
    });

    if (directMatch) {
        return { score: maxW, detail: `Đã từng làm tại ${targetUnit}`, matchedKeywords: matchedKw, allKeywords: keywords, directMatch: true };
    }

    const ratio = matchCount / keywords.length;
    let score = 0;
    let detail = '';
    let level = '';

    if (ratio >= 0.5) {
        score = Math.round(maxW * 0.85);
        detail = `Nhiều KN liên quan (${matchCount}/${keywords.length} keyword)`;
        level = 'high';
    } else if (ratio >= 0.25) {
        score = Math.round(maxW * 0.6);
        detail = `Một số KN (${matchCount}/${keywords.length} keyword)`;
        level = 'mid';
    } else if (matchCount > 0) {
        score = Math.round(maxW * 0.33);
        detail = `Ít KN (${matchCount}/${keywords.length} keyword)`;
        level = 'low';
    } else {
        score = 0;
        detail = 'Không có KN liên quan';
        level = 'none';
    }

    return { score, detail, matchedKeywords: matchedKw, unmatchedKeywords: unmatchedKw, allKeywords: keywords, level, directMatch: false };
}

function scoreMajor(person, targetUnit) {
    const maxW = weights.nganhNghe;
    if (maxW === 0) return { score: 0, detail: 'Bỏ qua' };

    const major = (person.nganhNghe || '').toLowerCase();
    if (!major) return { score: 0, detail: 'Không có ngành nghề' };

    const priorities = MAJOR_PRIORITY[targetUnit];
    if (!priorities) return { score: Math.round(maxW * 0.3), detail: 'Không có cấu hình' };

    // Check high priority
    for (const kw of priorities.high) {
        if (major.includes(kw.toLowerCase())) {
            return { score: maxW, detail: `Ngành ưu tiên cao: ${major}` };
        }
    }

    // Check related
    for (const kw of priorities.related) {
        if (major.includes(kw.toLowerCase())) {
            return { score: Math.round(maxW * 0.6), detail: `Ngành liên quan: ${major}` };
        }
    }

    // Nếu thuộc nhóm kỹ thuật điện chung
    const techKeywords = ['điện', 'kỹ thuật', 'công nghệ', 'tự động'];
    for (const kw of techKeywords) {
        if (major.includes(kw)) {
            return { score: Math.round(maxW * 0.3), detail: `Ngành kỹ thuật chung: ${major}` };
        }
    }

    return { score: 0, detail: `Ngành không liên quan: ${major}` };
}

function scoreLocation(person, targetUnit, targetLocation) {
    const maxW = weights.khuVuc;
    if (maxW === 0) return { score: 0, detail: 'Bỏ qua' };

    // Xác định cơ sở đích
    const targetCoSo = targetLocation || PHONGDOI_COSO_DEFAULT[targetUnit] || 'Cơ sở 1 (Vũng Tàu 1)';

    // Xác định cơ sở nguồn từ khu vực lưu trú
    const khuVuc = person.khuVuc || '';
    const sourceCoSo = KHUVU_TO_COSO[khuVuc] || 'Cơ sở 1 (Vũng Tàu 1)';

    // Tra ma trận khoảng cách
    const dist = (DISTANCE_MATRIX[sourceCoSo] && DISTANCE_MATRIX[sourceCoSo][targetCoSo]) ?? 3;

    let score = 0;
    let detail = '';

    if (dist === 0) {
        score = maxW;
        detail = `Cùng khu vực (${khuVuc})`;
    } else if (dist === 1) {
        score = Math.round(maxW * 0.85);
        detail = `Rất gần (${khuVuc} → ${targetCoSo})`;
    } else if (dist === 2) {
        score = Math.round(maxW * 0.6);
        detail = `Gần (${khuVuc} → ${targetCoSo})`;
    } else if (dist === 3) {
        score = Math.round(maxW * 0.3);
        detail = `Xa (${khuVuc} → ${targetCoSo})`;
    } else {
        score = 0;
        detail = `Rất xa / Biệt lập (${khuVuc} → ${targetCoSo})`;
    }

    return { score, detail };
}

function scoreEducation(person, targetUnit) {
    const maxW = weights.trinhDo;
    if (maxW === 0) return { score: 0, detail: 'Bỏ qua' };

    const rank = EDUCATION_RANK[person.trinhDo] || 1;
    const type = DEPT_TYPE[targetUnit] || 'field';

    let score = 0;
    let detail = person.trinhDo || 'Không rõ';

    if (type === 'office') {
        // Phòng ban: yêu cầu ĐH+
        if (rank >= 4) score = maxW;
        else if (rank === 3) score = Math.round(maxW * 0.5);
        else score = 0;
    } else if (type === 'field') {
        // Đội kỹ thuật: TC+ OK, ĐH bonus
        if (rank >= 4) score = maxW;
        else if (rank >= 2) score = Math.round(maxW * 0.7);
        else score = Math.round(maxW * 0.3);
    } else {
        // Mixed
        if (rank >= 4) score = maxW;
        else if (rank >= 2) score = Math.round(maxW * 0.5);
        else score = 0;
    }

    return { score, detail };
}

function scoreTenure(person) {
    const maxW = weights.thamNien;
    if (maxW === 0) return { score: 0, detail: 'Bỏ qua' };

    const history = person.quaTrinhCongTac || '';
    // Tìm mốc thời gian cuối cùng chuyển sang đơn vị hiện tại
    const datePattern = /(?:từ|Từ)\s+(?:ngày\s+)?(\d{1,2})[\/\-](\d{1,2})?[\/\-]?(\d{4})\s*(?:đến nay|:)/gi;
    let lastDate = null;
    let match;

    while ((match = datePattern.exec(history)) !== null) {
        const year = parseInt(match[3]);
        const month = parseInt(match[2] || match[1]) - 1;
        const day = parseInt(match[2] ? match[1] : 1);
        const d = new Date(year, month, day);
        if (!lastDate || d > lastDate) lastDate = d;
    }

    if (!lastDate) {
        return { score: Math.round(maxW * 0.5), detail: 'Không xác định được thâm niên' };
    }

    const now = new Date();
    const years = (now - lastDate) / (365.25 * 24 * 60 * 60 * 1000);

    let score = 0;
    let detail = '';

    if (years >= 5) {
        score = maxW;
        detail = `${years.toFixed(1)} năm (gắn bó lâu)`;
    } else if (years >= 3) {
        score = Math.round(maxW * 0.7);
        detail = `${years.toFixed(1)} năm`;
    } else if (years >= 1) {
        score = Math.round(maxW * 0.4);
        detail = `${years.toFixed(1)} năm`;
    } else {
        score = 0;
        detail = `${(years * 12).toFixed(0)} tháng (mới chuyển)`;
    }

    return { score, detail };
}

function scoreTransfers(person) {
    const maxW = weights.dieuChuyen;
    if (maxW === 0) return { score: 0, detail: 'Bỏ qua' };

    const history = person.quaTrinhCongTac || '';
    // Đếm số lần "Từ...đến..."
    const matches = history.match(/(?:từ|Từ)\s+\d/g);
    const count = matches ? matches.length : 0;

    let score = 0;
    let detail = `${count} lần`;

    if (count <= 3) {
        score = maxW;
        detail += ' (ít thay đổi)';
    } else if (count <= 6) {
        score = Math.round(maxW * 0.6);
        detail += ' (vừa phải)';
    } else {
        score = 0;
        detail += ' (nhiều lần)';
    }

    return { score, detail };
}

/** Hàm tổng hợp — chấm điểm 1 người */
function evaluatePerson(person, targetUnit, targetLocation) {
    const exp = scoreExperience(person, targetUnit);
    const major = scoreMajor(person, targetUnit);
    const loc = scoreLocation(person, targetUnit, targetLocation);
    const edu = scoreEducation(person, targetUnit);
    const tenure = scoreTenure(person);
    const transfer = scoreTransfers(person);

    const totalWeight = weights.kinhNghiem + weights.nganhNghe + weights.khuVuc + weights.trinhDo + weights.thamNien + weights.dieuChuyen;
    const totalScore = exp.score + major.score + loc.score + edu.score + tenure.score + transfer.score;

    // Normalize nếu tổng trọng số ≠ 100
    const normalizedScore = totalWeight > 0 ? Math.round(totalScore * 100 / totalWeight) : 0;

    return {
        person,
        totalScore: normalizedScore,
        rawScore: totalScore,
        maxScore: totalWeight,
        breakdown: {
            kinhNghiem: exp,
            nganhNghe: major,
            khuVuc: loc,
            trinhDo: edu,
            thamNien: tenure,
            dieuChuyen: transfer
        }
    };
}

// ============================================
// 5. UI HANDLERS
// ============================================

function runEvaluation() {
    const sourceUnits = getSelectedSources();
    const targetUnit = document.getElementById('selectTarget').value;
    const targetLocation = document.getElementById('selectTargetLocation').value;
    const count = parseInt(document.getElementById('inputCount').value) || 3;

    if (sourceUnits.length === 0 || !targetUnit) {
        alert('Vui lòng chọn đơn vị nguồn và đơn vị đích!');
        return;
    }

    if (sourceUnits.length === 1 && sourceUnits[0] === targetUnit) {
        alert('Đơn vị nguồn và đích phải khác nhau!');
        return;
    }

    // Lọc CBCNV thuộc các đơn vị nguồn, loại trừ đơn vị đích và lãnh đạo
    const candidates = allData.filter(d => sourceUnits.includes(d.phongDoi) && d.phongDoi !== targetUnit && d.maChucVu > 3);

    if (candidates.length === 0) {
        alert(`Không tìm thấy CBCNV phù hợp tại ${sourceUnit}!`);
        return;
    }

    // Chấm điểm toàn bộ
    const results = candidates.map(p => evaluatePerson(p, targetUnit, targetLocation));
    results.sort((a, b) => b.totalScore - a.totalScore);

    lastResults = results;
    const sourceLabel = sourceUnits.length === 1 ? sourceUnits[0] : `${sourceUnits.length} đơn vị`;
    renderResults(results, count, sourceLabel, targetUnit, targetLocation);

    // Show distance matrix
    document.getElementById('distanceInfo').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'block';
    document.getElementById('btnExport').disabled = false;
}

function renderResults(results, topN, source, target, targetLoc) {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';

    const displayed = results.slice(0, Math.min(topN * 3, results.length));

    displayed.forEach((r, idx) => {
        const rank = idx + 1;
        const isTop = rank <= topN;
        const p = r.person;
        const b = r.breakdown;

        const scoreClass = r.totalScore >= 70 ? 'score-high' : r.totalScore >= 40 ? 'score-mid' : 'score-low';
        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';

        // Data row (clickable)
        const tr = document.createElement('tr');
        tr.className = 'data-row' + (isTop ? ' top-pick' : '');
        tr.innerHTML = `
            <td class="col-rank"><span class="rank-badge ${rankClass}">${rank}</span></td>
            <td><span class="name-link">${p.hoTen}</span></td>
            <td class="col-role" style="font-size:12px;color:var(--text-secondary)">${p.chucVu}</td>
            <td class="col-unit" style="font-size:12px;color:var(--text-muted)">${p.toNhom || '—'}</td>
            <td style="font-size:12px">${p.khuVuc}</td>
            <td class="col-score"><span class="score-badge ${scoreClass}">${r.totalScore}</span></td>
            <td class="col-detail"><span class="detail-score" data-tooltip="${b.kinhNghiem.detail}">${b.kinhNghiem.score}</span></td>
            <td class="col-detail"><span class="detail-score" data-tooltip="${b.nganhNghe.detail}">${b.nganhNghe.score}</span></td>
            <td class="col-detail"><span class="detail-score" data-tooltip="${b.khuVuc.detail}">${b.khuVuc.score}</span></td>
            <td class="col-detail"><span class="detail-score" data-tooltip="${b.trinhDo.detail}">${b.trinhDo.score}</span></td>
            <td class="col-detail"><span class="detail-score" data-tooltip="${b.thamNien.detail}">${b.thamNien.score}</span></td>
            <td class="col-detail"><span class="detail-score" data-tooltip="${b.dieuChuyen.detail}">${b.dieuChuyen.score}</span></td>
        `;
        tbody.appendChild(tr);

        // Expand row (hidden by default)
        const expandTr = document.createElement('tr');
        expandTr.className = 'expand-row';
        expandTr.id = `expand-${idx}`;
        const matchedKw = b.kinhNghiem.matchedKeywords || [];
        const allKw = b.kinhNghiem.allKeywords || [];
        const highlightedHistory = highlightKeywords(p.quaTrinhCongTac || '', matchedKw);

        let kwTagsHtml = '';
        if (allKw.length > 0) {
            kwTagsHtml = '<div class="kw-tags" style="margin-top:6px">';
            allKw.forEach(kw => {
                const isMatch = matchedKw.map(k => k.toLowerCase()).includes(kw.toLowerCase());
                kwTagsHtml += `<span class="kw-tag ${isMatch ? 'kw-match' : 'kw-miss'}">${isMatch ? '✓' : '✗'} ${kw}</span>`;
            });
            kwTagsHtml += '</div>';
        }

        expandTr.innerHTML = `
            <td colspan="12">
                <div class="expand-content">
                    <div class="expand-grid">
                        <div class="expand-left">
                            <h4>📊 Phân tích Điểm</h4>
                            ${buildProgressBar(b.kinhNghiem.score, weights.kinhNghiem, '🎯 Kinh nghiệm', b.kinhNghiem.detail)}
                            ${buildProgressBar(b.nganhNghe.score, weights.nganhNghe, '🎓 Chuyên ngành', b.nganhNghe.detail)}
                            ${buildProgressBar(b.khuVuc.score, weights.khuVuc, '📍 Khu vực', b.khuVuc.detail)}
                            ${buildProgressBar(b.trinhDo.score, weights.trinhDo, '📚 Trình độ', b.trinhDo.detail)}
                            ${buildProgressBar(b.thamNien.score, weights.thamNien, '⏱️ Thâm niên', b.thamNien.detail)}
                            ${buildProgressBar(b.dieuChuyen.score, weights.dieuChuyen, '🔄 Đ.chuyển', b.dieuChuyen.detail)}
                            ${allKw.length > 0 ? `<div style="margin-top:12px"><strong style="font-size:11px;color:var(--text-secondary)">🔍 Keyword: ${matchedKw.length}/${allKw.length}</strong>${kwTagsHtml}</div>` : ''}
                        </div>
                        <div class="expand-right">
                            <h4>👤 ${p.hoTen} — ${p.trinhDo} ${p.nganhNghe || ''}</h4>
                            <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">MSNV: ${p.msnv} | ĐT: ${p.dienThoai} | ${p.phongDoi} — ${p.coSo}</div>
                            <h4 style="margin-top:12px">📜 Quá trình Công tác ${matchedKw.length > 0 ? '<span style="font-size:10px;color:var(--evn-orange);font-weight:400">— keyword tô vàng</span>' : ''}</h4>
                            <div class="person-history-content" style="max-height:200px">${highlightedHistory || 'Chưa có'}</div>
                        </div>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(expandTr);

        // Click handler
        tr.addEventListener('click', () => {
            const expandEl = document.getElementById(`expand-${idx}`);
            const wasOpen = expandEl.classList.contains('open');
            // Close all others
            document.querySelectorAll('.expand-row.open').forEach(el => el.classList.remove('open'));
            if (!wasOpen) expandEl.classList.add('open');
        });
    });

    // Update meta
    const locText = targetLoc ? ` → ${targetLoc}` : '';
    document.getElementById('resultsMeta').innerHTML =
        `${source} → ${target}${locText} | ${results.length} ứng viên | Top <strong>${topN}</strong> đề xuất`;
}

function highlightKeywords(text, keywords) {
    if (!keywords || !keywords.length || !text) return escapeHtml(text);
    let result = escapeHtml(text);
    keywords.forEach(kw => {
        const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
        result = result.replace(regex, '<mark class="kw-highlight">$1</mark>');
    });
    return result;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildProgressBar(score, maxWeight, label, detail, color) {
    const pct = maxWeight > 0 ? Math.round(score / maxWeight * 100) : 0;
    const barColor = pct >= 70 ? 'var(--score-high)' : pct >= 40 ? 'var(--score-mid)' : 'var(--score-low)';
    return `
        <div class="detail-row">
            <div class="detail-row-header">
                <span class="detail-row-label">${label}</span>
                <span class="detail-row-score" style="color:${barColor}">${score}<span style="color:var(--text-muted)">/${maxWeight}</span></span>
            </div>
            <div class="detail-bar-bg">
                <div class="detail-bar-fill" style="width:${pct}%;background:${barColor}"></div>
            </div>
            <div class="detail-row-reason">${detail}</div>
        </div>
    `;
}

function showPersonDetail(result) {
    const p = result.person;
    const b = result.breakdown;
    const targetUnit = document.getElementById('selectTarget').value;

    document.getElementById('personName').textContent = `${p.hoTen} — ${p.chucVu}`;

    const totalColor = result.totalScore >= 70 ? 'var(--score-high)' : result.totalScore >= 40 ? 'var(--score-mid)' : 'var(--score-low)';

    // Build keyword tags for experience
    let kwTagsHtml = '';
    const matchedKw = b.kinhNghiem.matchedKeywords || [];
    const allKw = b.kinhNghiem.allKeywords || [];
    if (allKw.length > 0) {
        kwTagsHtml = '<div class="kw-tags">';
        allKw.forEach(kw => {
            const isMatch = matchedKw.map(k => k.toLowerCase()).includes(kw.toLowerCase());
            kwTagsHtml += `<span class="kw-tag ${isMatch ? 'kw-match' : 'kw-miss'}">${isMatch ? '✓' : '✗'} ${kw}</span>`;
        });
        kwTagsHtml += '</div>';
    }

    // Highlighted history
    const highlightedHistory = highlightKeywords(p.quaTrinhCongTac || '', matchedKw);

    let html = `
        <!-- Tổng điểm lớn -->
        <div style="text-align:center;margin-bottom:20px;padding:16px;background:var(--bg-input);border-radius:var(--radius-sm)">
            <div style="font-size:42px;font-weight:800;color:${totalColor}">${result.totalScore}</div>
            <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Tổng điểm / 100</div>
        </div>

        <!-- 6 Progress Bars -->
        <div class="detail-breakdown">
            <h4 style="margin-bottom:14px;font-size:13px;color:var(--text-secondary)">📊 Phân tích Chi tiết</h4>
            ${buildProgressBar(b.kinhNghiem.score, weights.kinhNghiem, '🎯 Kinh nghiệm liên quan', b.kinhNghiem.detail)}
            ${buildProgressBar(b.nganhNghe.score, weights.nganhNghe, '🎓 Chuyên ngành đào tạo', b.nganhNghe.detail)}
            ${buildProgressBar(b.khuVuc.score, weights.khuVuc, '📍 Khu vực lưu trú', b.khuVuc.detail)}
            ${buildProgressBar(b.trinhDo.score, weights.trinhDo, '📚 Trình độ đào tạo', b.trinhDo.detail)}
            ${buildProgressBar(b.thamNien.score, weights.thamNien, '⏱️ Thâm niên', b.thamNien.detail)}
            ${buildProgressBar(b.dieuChuyen.score, weights.dieuChuyen, '🔄 Số lần điều chuyển', b.dieuChuyen.detail)}
        </div>

        <!-- Keyword Analysis -->
        ${allKw.length > 0 ? `
        <div class="detail-section">
            <h4 style="margin-bottom:10px;font-size:13px;color:var(--text-secondary)">🔍 Phân tích Keyword Kinh nghiệm → ${targetUnit}</h4>
            <p style="font-size:11px;color:var(--text-muted);margin-bottom:8px">
                Khớp <strong style="color:var(--score-high)">${matchedKw.length}</strong> / ${allKw.length} keyword.
                Các keyword được quét trong lịch sử công tác:
            </p>
            ${kwTagsHtml}
        </div>` : ''}

        <!-- Thông tin cá nhân -->
        <div class="detail-section">
            <h4 style="margin-bottom:10px;font-size:13px;color:var(--text-secondary)">👤 Thông tin Cá nhân</h4>
            <div class="person-info-grid">
                <div class="person-field">
                    <div class="person-field-label">MSNV</div>
                    <div class="person-field-value">${p.msnv}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Ngày sinh</div>
                    <div class="person-field-value">${p.ngaySinh}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Giới tính</div>
                    <div class="person-field-value">${p.gioiTinh}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Điện thoại</div>
                    <div class="person-field-value">${p.dienThoai}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Email</div>
                    <div class="person-field-value">${p.email}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Trình độ</div>
                    <div class="person-field-value">${p.trinhDo} — ${p.nganhNghe || 'N/A'}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Phòng Đội</div>
                    <div class="person-field-value">${p.phongDoi}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Tổ nhóm</div>
                    <div class="person-field-value">${p.toNhom || '—'}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Cơ sở</div>
                    <div class="person-field-value">${p.coSo}</div>
                </div>
                <div class="person-field">
                    <div class="person-field-label">Khu vực lưu trú</div>
                    <div class="person-field-value">${p.khuVuc} — ${p.diaChiThuongTru || ''}</div>
                </div>
            </div>
        </div>

        <!-- Quá trình công tác với highlight -->
        <div class="detail-section">
            <h4 style="margin-bottom:10px;font-size:13px;color:var(--text-secondary)">
                📜 Quá trình Công tác
                ${matchedKw.length > 0 ? '<span style="font-size:11px;color:var(--evn-orange);font-weight:400"> — keyword phù hợp được tô vàng</span>' : ''}
            </h4>
            <div class="person-history-content">${highlightedHistory || 'Chưa có dữ liệu'}</div>
        </div>
    `;

    document.getElementById('personBody').innerHTML = html;
    document.getElementById('personDialog').showModal();
}

// ============================================
// 6. SETTINGS MODAL
// ============================================

function initSettings() {
    const sliders = {
        wKinhNghiem: 'kinhNghiem',
        wNganhNghe: 'nganhNghe',
        wKhuVuc: 'khuVuc',
        wTrinhDo: 'trinhDo',
        wThamNien: 'thamNien',
        wDieuChuyen: 'dieuChuyen'
    };

    function updateTotalDisplay() {
        let total = 0;
        Object.entries(sliders).forEach(([sliderId, key]) => {
            const val = parseInt(document.getElementById(sliderId).value);
            document.getElementById(sliderId + 'Val').textContent = val;
            total += val;
        });
        const totalEl = document.getElementById('weightTotal');
        totalEl.textContent = total;
        totalEl.style.color = total === 100 ? 'var(--score-high)' : 'var(--evn-orange)';
    }

    Object.keys(sliders).forEach(sliderId => {
        document.getElementById(sliderId).addEventListener('input', updateTotalDisplay);
    });

    document.getElementById('btnApplyWeights').addEventListener('click', () => {
        Object.entries(sliders).forEach(([sliderId, key]) => {
            weights[key] = parseInt(document.getElementById(sliderId).value);
        });
        document.getElementById('settingsModal').classList.remove('active');
        // Re-run if results exist
        if (lastResults.length > 0) runEvaluation();
    });

    document.getElementById('btnResetWeights').addEventListener('click', () => {
        const defaults = { wKinhNghiem: 30, wNganhNghe: 25, wKhuVuc: 20, wTrinhDo: 10, wThamNien: 10, wDieuChuyen: 5 };
        Object.entries(defaults).forEach(([id, val]) => {
            document.getElementById(id).value = val;
        });
        updateTotalDisplay();
    });
}

// ============================================
// 7. EXPORT
// ============================================

function exportToCSV() {
    if (!lastResults.length) return;

    const headers = ['Hạng', 'Họ và tên', 'MSNV', 'Chức vụ', 'Phòng Đội', 'Tổ nhóm', 'Khu vực', 'Tổng điểm',
        'Kinh nghiệm', 'Chuyên ngành', 'Khu vực (đ)', 'Trình độ', 'Thâm niên', 'Điều chuyển'];

    const rows = lastResults.map((r, i) => {
        const p = r.person;
        const b = r.breakdown;
        return [
            i + 1, p.hoTen, p.msnv, p.chucVu, p.phongDoi, p.toNhom, p.khuVuc, r.totalScore,
            b.kinhNghiem.score, b.nganhNghe.score, b.khuVuc.score, b.trinhDo.score, b.thamNien.score, b.dieuChuyen.score
        ];
    });

    const BOM = '\uFEFF';
    const csv = BOM + [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `dieu-chuyen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================
// 8. INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initSettings();

    // Buttons
    document.getElementById('btnEvaluate').addEventListener('click', runEvaluation);
    document.getElementById('btnExport').addEventListener('click', exportToCSV);

    document.getElementById('btnReset').addEventListener('click', () => {
        document.querySelectorAll('#sourceOptions input[type=checkbox], #sourceAll').forEach(cb => cb.checked = false);
        updateSourceBtnText();
        document.getElementById('selectTarget').value = '';
        document.getElementById('selectTargetLocation').value = '';
        document.getElementById('inputCount').value = '3';
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('distanceInfo').style.display = 'none';
        document.getElementById('btnExport').disabled = true;
        lastResults = [];
    });

    // Multi-select source
    document.getElementById('sourceBtn').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('sourceDropdown').classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!document.getElementById('sourceMultiSelect').contains(e.target)) {
            document.getElementById('sourceDropdown').classList.remove('open');
        }
    });

    document.getElementById('sourceAll').addEventListener('change', (e) => {
        document.querySelectorAll('#sourceOptions input[type=checkbox]').forEach(cb => cb.checked = e.target.checked);
        updateSourceBtnText();
    });

    document.getElementById('sourceOptions').addEventListener('change', () => {
        const all = document.querySelectorAll('#sourceOptions input[type=checkbox]');
        const checked = document.querySelectorAll('#sourceOptions input[type=checkbox]:checked');
        document.getElementById('sourceAll').checked = all.length === checked.length;
        updateSourceBtnText();
    });

    // Modals
    document.getElementById('btnSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('active');
    });
    document.getElementById('btnCloseSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('active');
    });

    document.getElementById('settingsModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('settingsModal')) {
            document.getElementById('settingsModal').classList.remove('active');
        }
    });

    // Criteria toggle
    document.getElementById('criteriaToggle').addEventListener('click', () => {
        const toggle = document.getElementById('criteriaToggle');
        const body = document.getElementById('criteriaBody');
        toggle.classList.toggle('open');
        body.classList.toggle('open');
    });

    // Keyboard: ESC to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
            // Dialog handles its own ESC automatically
        }
    });
});
