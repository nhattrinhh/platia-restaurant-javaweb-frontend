export const validateRegisterForm = (formData) => {
    const errors = {};

    // Validate fullname
    if (!formData.fullname.trim()) {
        errors.fullname = 'Họ và tên không được để trống';
    } else if (formData.fullname.length < 2) {
        errors.fullname = 'Họ và tên phải có ít nhất 2 ký tự';
    } else if (formData.fullname.length > 100) {
        errors.fullname = 'Họ và tên không được vượt quá 100 ký tự';
    }

    // Validate email
    if (!formData.email.trim()) {
        errors.email = 'Email không được để trống';
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        } else if (formData.email.length > 100) {
            errors.email = 'Email không được vượt quá 100 ký tự';
        }
    }

    // Validate username
    if (!formData.username.trim()) {
        errors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
        errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (formData.username.length > 50) {
        errors.username = 'Tên đăng nhập không được vượt quá 50 ký tự';
    } else {
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(formData.username)) {
            errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang';
        }
    }

    // Validate password
    if (!formData.password.trim()) {
        errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (formData.password.length > 100) {
        errors.password = 'Mật khẩu không được vượt quá 100 ký tự';
    }

    // Validate confirmPassword
    if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    // Validate address
    if (!formData.address.trim()) {
        errors.address = 'Địa chỉ không được để trống';
    } else if (formData.address.length > 255) {
        errors.address = 'Địa chỉ không được vượt quá 255 ký tự';
    }

    // Validate phoneNumber
    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^(\+84|0)[0-9]{9,12}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    return errors;
};

export const validateLoginForm = (formData) => {
    const errors = {};

    // Validate username
    if (!formData.username.trim()) {
        errors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
        errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    } else if (formData.username.length > 50) {
        errors.username = 'Tên đăng nhập không được vượt quá 50 ký tự';
    } else {
        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (!usernameRegex.test(formData.username)) {
            errors.username = 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang';
        }
    }

    // Validate password
    if (!formData.password.trim()) {
        errors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (formData.password.length > 100) {
        errors.password = 'Mật khẩu không được vượt quá 100 ký tự';
    }

    return errors;


};
export const validateBookingForm = (formData) => {
    const errors = {};

    // Validate fullName
    if (!formData.fullName.trim()) {
        errors.fullName = 'Họ và tên không được để trống';
    } else if (formData.fullName.length < 2) {
        errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
    } else if (formData.fullName.length > 100) {
        errors.fullName = 'Họ và tên không được vượt quá 100 ký tự';
    } else {
        const fullNameRegex = /^[a-zA-Z\s\-']+$/;
        if (!fullNameRegex.test(formData.fullName)) {
            errors.fullName = 'Họ và tên chỉ được chứa chữ cái, khoảng trắng, dấu gạch ngang hoặc dấu nháy đơn';
        }
    }

    // Validate phoneNumber
    if (!formData.phoneNumber.trim()) {
        errors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^(\+84|0)[0-9]{9,12}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    // Validate bookingDate
    if (!formData.bookingDate) {
        errors.bookingDate = 'Ngày đặt bàn không được để trống';
    } else {
        const today = new Date().toISOString().split('T')[0];
        if (formData.bookingDate < today) {
            errors.bookingDate = 'Ngày đặt bàn phải là ngày hiện tại hoặc trong tương lai';
        }
    }

    // Validate bookingTime
    if (!formData.bookingTime) {
        errors.bookingTime = 'Giờ đặt bàn không được để trống';
    }

    // Validate numberOfGuests
    if (!formData.numberOfGuests) {
        errors.numberOfGuests = 'Số lượng khách không được để trống';
    } else if (formData.numberOfGuests < 1) {
        errors.numberOfGuests = 'Số lượng khách phải là số dương';
    } else if (formData.numberOfGuests > 50) {
        errors.numberOfGuests = 'Số lượng khách tối đa là 50';
    }

    // Validate area
    if (!formData.area) {
        errors.area = 'Khu vực không được để trống';
    } else if (!['indoor', 'vip', 'outdoor', 'terrace'].includes(formData.area)) {
        errors.area = 'Khu vực không hợp lệ';
    }

    // Validate specialRequests
    if (formData.specialRequests.length > 500) {
        errors.specialRequests = 'Yêu cầu đặc biệt không được vượt quá 500 ký tự';
    }

    return errors;
};