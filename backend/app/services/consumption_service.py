from ..models.customer import Customer
from ..extensions import db


class ConsumptionService:

    @staticmethod
    def get_all_customers() -> list[dict]:
        customers = Customer.query.all()
        return [c.to_dict() for c in customers]

    @staticmethod
    def get_customer_dashboard(customer_id: int) -> dict | None:
        customer = db.session.get(Customer, customer_id)
        if not customer:
            return None
        return {
            'customer': customer.to_dict(),
            'balance': customer.balance.to_dict() if customer.balance else None,
            'data_consumption': customer.data_consumption.to_dict() if customer.data_consumption else None,
            'minute_consumption': customer.minute_consumption.to_dict() if customer.minute_consumption else None,
        }

    @staticmethod
    def get_customer_balance(customer_id: int) -> dict | None:
        customer = db.session.get(Customer, customer_id)
        if not customer or not customer.balance:
            return None
        return customer.balance.to_dict()

    @staticmethod
    def get_customer_consumption(customer_id: int) -> dict | None:
        customer = db.session.get(Customer, customer_id)
        if not customer:
            return None
        return {
            'data': customer.data_consumption.to_dict() if customer.data_consumption else None,
            'minutes': customer.minute_consumption.to_dict() if customer.minute_consumption else None,
        }
