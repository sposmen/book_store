import OrdersList from './OrdersList';

class MyOrdersList extends OrdersList{
  ordersUrl(){
    let skip = (this.state.page - 1) * this.pageSize;
    return `/api/orders?skip=${skip}&limit=${this.pageSize}`;
  }

  ordersCountUrl(){
    return '/api/orders/count?'
  }

  // Don't show the new Button
  showNewButton() {
    return '';
  }
}

export default MyOrdersList;
