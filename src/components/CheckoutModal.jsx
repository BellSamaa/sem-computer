import { useState } from 'react';
import { formatPrice } from '../utils/compatibilityEngine';

export default function CheckoutModal({ selectedComponents, totalPrice, onClose }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const buildSummary = Object.entries(selectedComponents)
            .filter(([, v]) => v)
            .map(([k, v]) => `${k.toUpperCase()}: ${v.name} - ${formatPrice(v.price)}`)
            .join('\n');

        formData.append('build_details', buildSummary);
        formData.append('total_price', formatPrice(totalPrice));

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
            .then(() => {
                setSuccess(true);
            })
            .catch((error) => {
                console.error(error);
                alert('Đã có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
                setLoading(false);
            });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content checkout-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Xác nhận Đặt hàng PC</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {success ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h4>Đơn hàng đã được gửi thành công!</h4>
                            <p>Chúng tôi đã nhận được thông tin cấu hình của bạn. Nhân viên Semcomputer sẽ sớm liên hệ lại qua số điện thoại để tư vấn và tiến hành thanh toán cho bạn.</p>
                            <button className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }} onClick={onClose}>Đóng lại</button>
                        </div>
                    ) : (
                        <>
                            <p className="checkout-subtitle">Vui lòng điền thông tin để chúng tôi liên lạc và xác nhận bill cho bạn.</p>
                            <form className="checkout-form" onSubmit={handleSubmit} data-netlify="true" name="order-form">
                                <input type="hidden" name="form-name" value="order-form" />
                                <div className="form-group">
                                    <label>Họ và Tên *</label>
                                    <input type="text" name="name" required placeholder="Nhập tên của bạn" />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại *</label>
                                    <input type="tel" name="phone" required placeholder="Nhập số điện thoại để liên lạc" />
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ nhận hàng</label>
                                    <textarea name="address" rows="2" placeholder="Nhập địa chỉ của bạn (Tuỳ chọn)"></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú thêm</label>
                                    <textarea name="note" rows="2" placeholder="Ví dụ: Mong muốn tư vấn thêm đèn LED, nâng cấp thêm RAM (Tuỳ chọn)..."></textarea>
                                </div>

                                <div className="checkout-summary">
                                    <div className="checkout-total">
                                        <span>Tổng dự tính:</span>
                                        <span className="amount">{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <div className="form-actions" style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                    <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>Hủy</button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2 }} disabled={loading}>
                                        {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu Đặt PC'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
