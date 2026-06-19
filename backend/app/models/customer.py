from ..extensions import db


class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False, unique=True)
    account_number = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    plan_name = db.Column(db.String(100), nullable=False)

    balance = db.relationship('AccountBalance', backref='customer', uselist=False, lazy='joined')
    data_consumption = db.relationship('DataConsumption', backref='customer', uselist=False, lazy='joined')
    minute_consumption = db.relationship('MinuteConsumption', backref='customer', uselist=False, lazy='joined')

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'account_number': self.account_number,
            'email': self.email,
            'plan_name': self.plan_name,
        }


class AccountBalance(db.Model):
    __tablename__ = 'account_balances'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    currency = db.Column(db.String(3), nullable=False, default='USD')

    def to_dict(self) -> dict:
        return {
            'amount': float(self.amount),
            'currency': self.currency,
        }


class DataConsumption(db.Model):
    __tablename__ = 'data_consumptions'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    used_mb = db.Column(db.Float, nullable=False, default=0.0)
    total_mb = db.Column(db.Float, nullable=False)
    period_start = db.Column(db.Date, nullable=False)
    period_end = db.Column(db.Date, nullable=False)

    def to_dict(self) -> dict:
        used_gb = round(self.used_mb / 1024, 2)
        total_gb = round(self.total_mb / 1024, 2)
        percentage = round((self.used_mb / self.total_mb) * 100, 1) if self.total_mb > 0 else 0.0
        return {
            'used_mb': self.used_mb,
            'total_mb': self.total_mb,
            'used_gb': used_gb,
            'total_gb': total_gb,
            'percentage': percentage,
            'period_start': self.period_start.isoformat(),
            'period_end': self.period_end.isoformat(),
        }


class MinuteConsumption(db.Model):
    __tablename__ = 'minute_consumptions'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    used_minutes = db.Column(db.Integer, nullable=False, default=0)
    total_minutes = db.Column(db.Integer, nullable=False)
    period_start = db.Column(db.Date, nullable=False)
    period_end = db.Column(db.Date, nullable=False)

    def to_dict(self) -> dict:
        percentage = round((self.used_minutes / self.total_minutes) * 100, 1) if self.total_minutes > 0 else 0.0
        return {
            'used': self.used_minutes,
            'total': self.total_minutes,
            'percentage': percentage,
            'period_start': self.period_start.isoformat(),
            'period_end': self.period_end.isoformat(),
        }
