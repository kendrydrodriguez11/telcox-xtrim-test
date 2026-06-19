class TestHealth:
    def test_returns_operational_status(self, client):
        response = client.get('/bss/health')
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert data['data']['status'] == 'operational'


class TestCustomerList:
    def test_returns_customer_list(self, client):
        response = client.get('/bss/customers')
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True
        assert isinstance(data['data']['customers'], list)
        assert data['data']['total'] >= 1

    def test_customer_has_required_fields(self, client):
        response = client.get('/bss/customers')
        customers = response.get_json()['data']['customers']
        assert len(customers) > 0
        customer = customers[0]
        for field in ('id', 'name', 'phone_number', 'account_number', 'email', 'plan_name'):
            assert field in customer


class TestCustomerDashboard:
    def test_returns_dashboard_data(self, client):
        response = client.get('/bss/customers/1/dashboard')
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True

    def test_dashboard_contains_all_sections(self, client):
        data = client.get('/bss/customers/1/dashboard').get_json()['data']
        assert 'customer' in data
        assert 'balance' in data
        assert 'data_consumption' in data
        assert 'minute_consumption' in data

    def test_customer_section_fields(self, client):
        customer = client.get('/bss/customers/1/dashboard').get_json()['data']['customer']
        for field in ('name', 'phone_number', 'account_number', 'email', 'plan_name'):
            assert field in customer

    def test_balance_section_fields(self, client):
        balance = client.get('/bss/customers/1/dashboard').get_json()['data']['balance']
        assert 'amount' in balance
        assert 'currency' in balance
        assert balance['currency'] == 'USD'
        assert isinstance(balance['amount'], float)

    def test_data_consumption_fields(self, client):
        dc = client.get('/bss/customers/1/dashboard').get_json()['data']['data_consumption']
        for field in ('used_mb', 'total_mb', 'used_gb', 'total_gb', 'percentage', 'period_start', 'period_end'):
            assert field in dc

    def test_minute_consumption_fields(self, client):
        mc = client.get('/bss/customers/1/dashboard').get_json()['data']['minute_consumption']
        for field in ('used', 'total', 'percentage', 'period_start', 'period_end'):
            assert field in mc

    def test_data_percentage_is_accurate(self, client):
        dc = client.get('/bss/customers/1/dashboard').get_json()['data']['data_consumption']
        expected = round((dc['used_mb'] / dc['total_mb']) * 100, 1)
        assert dc['percentage'] == expected

    def test_minute_percentage_is_accurate(self, client):
        mc = client.get('/bss/customers/1/dashboard').get_json()['data']['minute_consumption']
        expected = round((mc['used'] / mc['total']) * 100, 1)
        assert mc['percentage'] == expected

    def test_percentage_within_valid_range(self, client):
        data = client.get('/bss/customers/1/dashboard').get_json()['data']
        assert 0 <= data['data_consumption']['percentage'] <= 100
        assert 0 <= data['minute_consumption']['percentage'] <= 100

    def test_used_gb_derived_from_mb(self, client):
        dc = client.get('/bss/customers/1/dashboard').get_json()['data']['data_consumption']
        assert dc['used_gb'] == round(dc['used_mb'] / 1024, 2)

    def test_nonexistent_customer_returns_404(self, client):
        response = client.get('/bss/customers/9999/dashboard')
        assert response.status_code == 404
        data = response.get_json()
        assert data['success'] is False
        assert 'error' in data
        assert 'message' in data['error']


class TestCustomerBalance:
    def test_returns_balance(self, client):
        response = client.get('/bss/customers/1/balance')
        assert response.status_code == 200
        data = response.get_json()['data']
        assert 'amount' in data
        assert 'currency' in data

    def test_nonexistent_customer_returns_404(self, client):
        response = client.get('/bss/customers/9999/balance')
        assert response.status_code == 404


class TestCustomerConsumption:
    def test_returns_consumption(self, client):
        response = client.get('/bss/customers/1/consumption')
        assert response.status_code == 200
        data = response.get_json()['data']
        assert 'data' in data
        assert 'minutes' in data

    def test_nonexistent_customer_returns_404(self, client):
        response = client.get('/bss/customers/9999/consumption')
        assert response.status_code == 404
