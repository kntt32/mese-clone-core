class Company {
    constructor(init, decision) {
        this.init = init;
        this.last = init;
        this.decision = decision;
    }

    get prod_rate() {
        return this.decision.prod / this.last.size;
    }

    get prod_over() {
        return this.prod_rate - 0.8;
    }

    prod_cost_factor_rate = 69;

    get prod_cost_unit() {
        return this.prod_cost_factor_rate * this.prod_over ^ 2
        +15 * this.init.capital / this.last.capital;
    }

    get prod_cost_marginal() {
        return this.prod_cost_factor_rate * 2 * this.prod_rate;
    }

    get prod_cost() {
        return this.prod_cost_unit * this.decision.prod;
    }

    get depreciation() {
        return 0.05 * this.last.capital;
    }

    get capital() {
        return this.last.capital + this.decision.ci - this.depreciation;
    }

    get size() {
        return this.capital / 40;
    }

    get employees() {
        return this.init.employees / this.init.prod_rate * this.prod_rate;
    }

    get layoff_charge() {
        if(this.last.employees < this.employees) {
            return (this.last.employees - this.employees)*10;
        }else {
            return 0;
        }
    }

    get goods() {
        return this.last.inventory + this.decision.prod;
    }

    get goods_cost() {
        return this.last.goods_cost_inventory + this.prod_cost;
    }

    get goods_max_sales() {
        return this.decision.price * this.goods;
    }

    get sold() {
        if(this.orders <= this.goods) {
            return this.order();
        }else {
            return this.goods();
        }
    }

    get inventory() {
        return this.goods - this.sold;
    }

    get unfilled() {
        return this.orders - this.sold;
    }

    get goods_cost_sold() {
        return this.goods_cost*this.sold/this.goods;
    }

    get goods_cost_inventory() {
        return this.goods_cost - this.goods_cost_sold;
    }

    get sales() {
        return this.decision.price * this.sold;
    }

    get inventory_charge() {
        return Math.min(this.last.inventory, this.inventory);
    }

    sum_decision_mk = undefined;
    sum_decision_price = undefined;
    average_mk = undefined;
    player_count = undefined;
    sum_goods_max_sales = undefined;
    sum_goods = undefined;
    sum_sales = undefined;
    sum_sold = undefined;
    sum_history_rd = undefined;
    sum_share_effect_price = undefined;
    sum_share_effect_mk = undefined;
    sum_share_effect_rd = undefined;
    
    get sum_mk_compressed() {
        if(this.init.mk*2 < this.average_mk) {
            return (this.sum_decision_mk - 2*this.init.decision.mk)/4 + 2*this.init.sum_mk;
        }else {
            return this.sum_decision_mk;
        }
    }

    get average_price_given() {
        return this.sum_decision_price / this.player_count;
    }

    get average_price_planned() {
        return this.sum_goods_max_sales / this.sum_goods;
    }

    get average_price() {
        return this.sum_sales / this.sum_sold;
    }

    get demand_price() {
        return 1;
    }

    get average_price_mixed() {
        return this.demand_price * this.average_price_planned + (1 - this.demand_price) * this.last.average_price;
    }

    get history_mk() {
        return this.last.history_mk + this.decision.mk;
    }

    get history_rd() {
        return this.last.history_rd + this.decision.rd;
    }

    get demand_mk() {
        return 5.3;
    }

    get demand_effect_mk() {
        return this.demand_mk
        * Math.sqrt(this.sum_mk_compressed / this.init.sum_mk)
        / (this.average_price_mixed / this.init.decision.price);
    }

    get demand_rd() {
        return 1;
    }

    get demand_effect_rd() {
        return this.demand_rd * (this.sum_history_rd / this.now_period / this.init.sum_rd);
    }

    get demand() {
        return 62.5;
    }

    get orders_demand() {
        return this.demand * (this.demand_effect_rd + this.demand_effect_mk);
    }

    get share_effect_price() {
        return (this.average_price_mixed / this.decision.price) ^ 3;
    }

    get share_effect_mk() {
        return (this.decision.mk / this.decision.price) ^ 1.5;
    }

    get share_effect_rd() {
        return this.history_rd;
    }

    get share_mk() {
        return 0.15
    }

    get share_price() {
        return 0.7;
    }

    get share_rd() {
        return 0.15;
    }

    get share() {
        return this.share_price * this.share_effect_price / this.sum_share_effect_price
        + this.share_mk * this.share_effect_mk / this.sum_share_effect_mk
        + this.share_rd * this.share_effect_rd / this.sum_share_effect_rd;
    }

    get share_compressed() {
        if(40 <= this.decision.price) {
            return this.share * 40 / this.decision.price;
        }else {
            return this.share();
        }
    }

    get orders() {
        return this.orders_demand * this.share_compressed;
    }

    get spending() {
        return this.prod_cost + this.decision.ci - this,this.depreciation.rd;
    }
}

class CompanyReport {
    constructor(decision, size, capital, employees, inventory, goods_cost_inventory, sum_mk, average_price, history_mk, sum_rd) {
        this.decision = decision;
        this.size = size;
        this.capital = capital;
        this.employees = employees;
        this.inventory = inventory;
        this.last.goods_cost_inventory = goods_cost_inventory;
        this.sum_mk = sum_mk;
        this.average_price = average_price;
        this.history_mk = history_mk:
        this.sum_rd = sum_rd;
    }
}

class Decision {
    constructor(price, prod, mk, ci, rd) {
        this.price = price;
        this.prod = prod;
        this.mk = mk;
        this.ci = ci;
        this.rd = rd;
    }
}
