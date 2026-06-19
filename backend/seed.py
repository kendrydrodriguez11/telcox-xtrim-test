from datetime import date
from app import create_app
from app.extensions import db
from app.models.customer import Customer, AccountBalance, DataConsumption, MinuteConsumption

app = create_app()

PERIOD_START = date(2024, 6, 1)
PERIOD_END = date(2024, 6, 30)

CUSTOMERS = [
    {
        'name': 'María González',
        'phone_number': '+593 98 123 4567',
        'account_number': 'ACC-100001',
        'email': 'maria.gonzalez@telcox.ec',
        'plan_name': 'Fibra Ilimitado 200 Mbps',
        'balance': 38.50,
        'data_used_mb': 102400.0,
        'data_total_mb': 204800.0,
        'minutes_used': 320,
        'minutes_total': 1000,
    },
    {
        'name': 'Carlos Mendoza',
        'phone_number': '+593 99 234 5678',
        'account_number': 'ACC-100002',
        'email': 'carlos.mendoza@telcox.ec',
        'plan_name': 'Móvil Plus 50 GB',
        'balance': 12.75,
        'data_used_mb': 46080.0,
        'data_total_mb': 51200.0,
        'minutes_used': 480,
        'minutes_total': 500,
    },
    {
        'name': 'Ana Rodríguez',
        'phone_number': '+593 96 345 6789',
        'account_number': 'ACC-100003',
        'email': 'ana.rodriguez@telcox.ec',
        'plan_name': 'Empresarial Pro 500 GB',
        'balance': 145.00,
        'data_used_mb': 30720.0,
        'data_total_mb': 512000.0,
        'minutes_used': 150,
        'minutes_total': 3000,
    },
    {
        'name': 'Roberto Torres',
        'phone_number': '+593 97 456 7890',
        'account_number': 'ACC-100004',
        'email': 'roberto.torres@telcox.ec',
        'plan_name': 'Básico 10 GB',
        'balance': 3.20,
        'data_used_mb': 9728.0,
        'data_total_mb': 10240.0,
        'minutes_used': 195,
        'minutes_total': 200,
    },
]


def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()

        for entry in CUSTOMERS:
            customer = Customer(
                name=entry['name'],
                phone_number=entry['phone_number'],
                account_number=entry['account_number'],
                email=entry['email'],
                plan_name=entry['plan_name'],
            )
            db.session.add(customer)
            db.session.flush()

            db.session.add(AccountBalance(
                customer_id=customer.id,
                amount=entry['balance'],
                currency='USD',
            ))
            db.session.add(DataConsumption(
                customer_id=customer.id,
                used_mb=entry['data_used_mb'],
                total_mb=entry['data_total_mb'],
                period_start=PERIOD_START,
                period_end=PERIOD_END,
            ))
            db.session.add(MinuteConsumption(
                customer_id=customer.id,
                used_minutes=entry['minutes_used'],
                total_minutes=entry['minutes_total'],
                period_start=PERIOD_START,
                period_end=PERIOD_END,
            ))

        db.session.commit()
        print(f'Base de datos poblada con {len(CUSTOMERS)} clientes.')


if __name__ == '__main__':
    seed()
