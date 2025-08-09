import React, { useEffect, useState } from 'react';
import {
  Container, Row, Col, Table, Button, Form,
  InputGroup, Dropdown, Pagination
} from 'react-bootstrap';
import {
  FaSearch, FaFilter, FaEllipsisV, FaEye,
  FaFileInvoice, FaRupeeSign, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import AdminHeader from '../../component/header/AdminHeader';
import { getAllPayments } from '../../services/paymentService';
import dummyuser from "../../assets/images/dummyUser.jpeg"
import { useNavigate } from 'react-router-dom';
import PayPrmodel from '../../component/models/PayPrModel';


const statusMap = {
  Pending: { color: '#f4b400', textColor: '#000' },
  Paid: { color: '#34a853', textColor: '#fff' },
  Overdue: { color: '#ea4335', textColor: '#fff' },
  Sanctioned: { color: '#4285f4', textColor: '#fff' },
  Rejected: { color: '#9e9e9e', textColor: '#000' },
};

export default function PaymentRequestListAdmin() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await getAllPayments();
        setPayments(data);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <>
      <AdminHeader />
      <Container
        fluid
        style={{ backgroundColor: 'var(--admin-dashboard-bg-color)', minHeight: '100vh' }}
        className="py-4 px-4"
      >
        {/* Summary Cards */}
        <Row className="mb-4">
          {[
            { label: 'Total Requests', value: payments.length },
            { label: 'Pending', value: payments.filter(p => p.status === 'Pending').length },
            { label: 'Paid', value: payments.filter(p => p.status === 'Paid').length },
            { label: 'Overdue', value: payments.filter(p => p.status === 'Overdue').length },
          ].map((item, i) => (
            <Col key={i} md={3} sm={6} className="mb-2">
              <div
                className="p-3 rounded border"
                style={{
                  backgroundColor: 'var(--admin-component-bg-color)',
                  borderColor: 'var(--admin-border-color)'
                }}
              >
                <div className="text-muted small">{item.label}</div>
                <div className="fs-4 fw-semibold">{item.value}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Search and Filters */}
        <Row className="align-items-center mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: 'white' }}>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control placeholder="Search users, tenders..." />
            </InputGroup>
          </Col>
          <Col md={6} className="text-end">
            <Button variant="light" className="me-2">
              <FaFilter className="me-1" /> Filter by Status
            </Button>
            <Button variant="outline-secondary">Advanced Filter</Button>
          </Col>
        </Row>

        {/* Payment Table */}
        <div className="table-responsive">
          <Table
            responsive
            hover
            className="shadow-sm"
            style={{
              backgroundColor: 'var(--admin-component-bg-color)',
              border: '1px solid var(--admin-border-color)'
            }}
          >
            <thead style={{ backgroundColor: '#e7edf3' }}>
              <tr className="text-muted small text-uppercase">
                <th>S.NO</th>
                <th>user</th>
                <th>Uploaded By</th>
                <th>Tender</th>
                <th>Amount</th>
                <th>Expense No</th>
                <th>Status</th>
                <th>Request Date</th>
                {/* <th>Payment Date</th> */}
                <th>Reference Mode</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((d, i) => {
                const status = d.status || 'Pending';
                const icon = {
                  Pending: <FaExclamationTriangle className="me-1" />,
                  Paid: <FaCheckCircle className="me-1" />,
                  Overdue: <FaTimesCircle className="me-1" />,
                  Sanctioned: <FaCheckCircle className="me-1" />,
                  Rejected: <FaTimesCircle className="me-1" />
                }[status];

                const bgColor = i % 2 === 0 ? 'var(--admin-dashboard-bg-color)' : 'var(--admin-component-bg-color)';
                const payDisabled = status === 'Rejected';

                return (
                  <tr key={i} style={{ backgroundColor: bgColor }}>
                    {/* s.no  */}
                    <td>
                      <div
                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: '#fcebea',
                          width: '30px',
                          height: '30px',
                          fontSize: '0.9rem'
                        }}
                      >
                        {i + 1}
                      </div>
                    </td>
                    {/* image  */}
                    <td>
                      <img
                        src={d.user?.profile || dummyuser}
                        alt=""
                        style={{ width: '35px', height: '35px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </td>
                    {/* username */}
                    <td>{d.user?.name || '—'}</td>

                    <td>{d.tender || '—'}</td>
                    <td>{d.amount ? `₹${d.amount}` : '—'}</td>
                    <td>{d.expenseNo || '—'}</td>
                    {/* status  */}
                    <td>
                      <span
                        className="badge"
                        style={{
                          backgroundColor: statusMap[status]?.color,
                          color: statusMap[status]?.textColor
                        }}
                      >
                        {icon} {status}
                      </span>
                    </td>
                    <td>{d.submittedAt?.slice(0, 10) || '—'}</td>
                    {/* <td>{d.paymentDate?.slice(0, 10) || '—'}</td> */}
                    <td>{d.refMode || '—'}</td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          href={d.image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaFileInvoice />
                        </Button>
                        <Button
                          size="sm"
                          disabled={payDisabled}
                          style={{
                            backgroundColor: payDisabled ? 'var(--admin-btn-secondary-bg)' : 'var(--admin-btn-success-bg)',
                            color: 'var(--admin-btn-success-text)',
                            border: 'none'
                          }}
                          onClick={() => {
                            setSelectedPaymentId(d._id);
                            setShowPayModal(true);
                          }}
                        >
                          <FaRupeeSign className="me-1" /> Pay
                        </Button>


                        <Button
                          variant="outline-secondary"
                          size="sm"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => navigate(`/admin/payment-request/${d._id}`)}
                        >
                          <FaEllipsisV />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <Row className="mt-2">
          <Col className="text-muted small">
            Showing 1–{payments.length} of {payments.length} entries
          </Col>
          <Col className="text-end">
            <Pagination className="mb-0 justify-content-end">
              <Pagination.Prev />
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </Col>
        </Row>
      </Container>

      <PayPrmodel
        show={showPayModal}
        onHide={() => setShowPayModal(false)}
        id={selectedPaymentId}
      />

    </>
  );
}
