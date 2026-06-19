import pytest
from datetime import date
from app import create_app
from app.extensions import db as _db
from app.models.customer import Customer, AccountBalance, DataConsumption, MinuteConsumption


@pytest.fixture(scope='session')
def app():
    application = create_app('testing')
    with application.app_context():
        _db.create_all()
        _seed_test_data()
        yield application
        _db.drop_all()


@pytest.fixture(scope='session')
def client(app):
    return app.test_client()


def _seed_test_data():
    customer = Customer(
        name='Laura Vásquez',
        phone_number='+593 90 000 0001',
        account_number='ACC-TEST01',
        email='laura.vasquez@test.telcox.ec',
        plan_name='Plan Test Pro',
    )
    _db.session.add(customer)
    _db.session.flush()

    _db.session.add(AccountBalance(customer_id=customer.id, amount=50.00, currency='USD'))
    _db.session.add(DataConsumption(
        customer_id=customer.id,
        used_mb=10240.0,
        total_mb=51200.0,
        period_start=date(2024, 6, 1),
        period_end=date(2024, 6, 30),
    ))
    _db.session.add(MinuteConsumption(
        customer_id=customer.id,
        used_minutes=100,
        total_minutes=500,
        period_start=date(2024, 6, 1),
        period_end=date(2024, 6, 30),
    ))
    _db.session.commit()
