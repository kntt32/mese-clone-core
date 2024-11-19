class Industry {
    constructor(init, player_count) {
        this.company = [];
        for(let i=0; i<player_count; i++) {
            this.company.push(new Company(init));
            this.company[i].player_count = player_count;
        }
    }

    next(decisions) {
        if(this.company.length != decisions.length) {
            alert("Err");
            return undefined;
        }
        for(let i=0; i<this.company.length; i++) {
            this.company[i].decision = decisions[i];
        }
        let sum_decision_mk = calc_sum_decision_mk(decisions);
        let sum_decision_price = calc_sum_decision_price(decisions);
        let sum_goods_max_sales = calc_sum_goods_max_sales(this.company);
        let sum_goods = calc_sum_goods(this.company);
        let sum_sales = calc_sum_sales(this.company);
        let sum_sold = calc_sum_sold(this.company);
        let sum_history_rd = calc_sum_history_rd(this.company);

        for(let i=0; i<this.company.length; i++) {
            this.company[i].sum_decision_mk = sum_decision_mk;
            this.company[i].sum_decision_price = sum_decision_price;
            this.company[i].average_mk = sum_decision_mk / this.company.length;
            this.company[i].sum_goods_max_sales = sum_goods_max_sales;
            this.company[i].sum_goods = sum_goods;
            this.company[i].sum_sales = sum_sales;
            this.company[i].sum_sold = sum_sold;
            this.company[i].sum_history_rd = sum_history_rd;
        }

        function calc_sum_decision_mk(decisions) {
            let sum = 0;
            for(let i=0; i<decisions.length; i++) {
                sum += decisions.mk;
            }
            return sum;
        }

        function calc_sum_decision_price(decisions) {
            let sum = 0;
            for(let i=0; i<decisions.length; i++) {
                sum += decisions[i].price;
            }
            return sum;
        }

        function calc_sum_goods_max_sales(companies) {
            let sum = 0;
            for(let i=0; i<companies.length; i++) {
                sum += companies[i].goods_max_sales;
            }
            return sum;
        }

        function calc_sum_goods(companies) {
            let sum = 0;
            for(let i=0; i<companies.length; i++) {
                sum += companies[i].goods;
            }
            return sum;
        }

        function calc_sum_sales(companies) {
            let sum = 0;
            for(let i=0; i<companies.length; i++) {
                sum += companies[i].sales;
            }
            return sum;
        }

        function calc_sum_sold(companies) {
            let sum = 0
            for(let i=0; i<companies.length; i++) {
                sum += companies[i].sold;
            }
            return sum;
        }

        function calc_sum_history_rd(companies) {
            let sum = 0;
            for(let i=0; i<companies.length; i++) {
                sum += companies[i].history_rd;
            }
            return sum;
        }
    }
}

class Company {
    constructor(init) {
        this.init = init;
        this.last = init;
        this.decision = undefined;
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
    sum_history_mk = undefined;
    sum_share_effect_price = undefined;
    sum_share_effect_mk = undefined;
    sum_share_effect_rd = undefined;
    sum_size = undefined;
    
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

    get balance_early() {
        return this.last.cash - this.last.loan - this.spending;
    }

    get loan_early() {
        if(this.balance_early < 0) {
            return - this.balance_early;
        }else {
            return 0;
        }
    }

    get interest() {
        if(this.loan_early == 0) {
            return this.interest_rate / 8 * this.last.cach;
        }else {
            return this.interest_rate / 4 * this.loan_early;
        }
    }

    get cost_before_tax() {
        return this.goods_cost_sold + this.depreciation + this.decision.mk + this.decision.rd - this.interest + this.inventory_charge + 1;
    }

    get profit_before_tax() {
        return this.sales - this.cost_before_tax;
    }

    get balance() {
        return this.last.cach - this.last.loan + this.loan_early + this.profit - this.decision.ci + this.depreciation + this.goods_cost_sold - this.prod_cost;
    }

    get loan() {
        if(0 <= this.balance) {
            return this.loan_early;
        }else {
            return this.loan_early - this.balance;
        }
    }

    get cach() {
        if(0 <= this.balance) {
            return this.balance;
        }else {
            return 0;
        }
    }

    get retein() {
        return this.last.retein + this.profit;
    }

    get mpi_a() {
        return 50 * this.retein / this.now_period / this.init.retein;
    }

    get mpi_b() {
        return 10 * (this.history_rd + this.history_mk) / (this.sum_history_rd + this.sum_history_mk);
    }

    get mpi_c() {
        return 10 * this.size / this.sum_size * this.player_count;
    }

    get mpi_d() {
        return 10 * (1 - Math.abs(this.prod_over));
    }

    get mpi_e() {
        return 10 * this.sold / this.sum_sold * this.player_count;
    }

    get mpi_f() {
        let r = 10 * this.sold / this.last.sold / this.sum_sales * this.last.sum_sales;
        if(r <= 20) {
            return r;
        }else {
            return 20;
        }
    }

    get mpi() {
        return this.mpi_a + this.mpi_b + this.mpi_c + this.mpi_d + this.mpi_e + this.mpi_f;
    }
}

class CompanyReport {
    constructor(decision, size, capital, employees, inventory, goods_cost_inventory, sum_mk, average_price, history_mk, history_rd, sum_rd, cach, loan, retein, sum_sales) {
        this.decision = decision;
        this.size = size;
        this.capital = capital;
        this.employees = employees;
        this.inventory = inventory;
        this.last.goods_cost_inventory = goods_cost_inventory;
        this.sum_mk = sum_mk;
        this.average_price = average_price;
        this.history_mk = history_mk;
        this.history_rd = history_rd;
        this.sum_rd = sum_rd;
        this.cach = cach;
        this.loan = loan;
        this.retein = retein;
        this.sum_sales = sum_sales;
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
