DROP TABLE public.udemy_sales;
CREATE TABLE public.udemy_sales
(
    sales_date date NOT NULL,
    sales_volume integer,
    CONSTRAINT udemy_sales_pkey PRIMARY KEY (sales_date)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
ALTER TABLE public.udemy_sales OWNER to postgres;

insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201801', 'YYYYMM'), 0);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201802', 'YYYYMM'), 50);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201803', 'YYYYMM'), 100);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201804', 'YYYYMM'), 25);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201805', 'YYYYMM'), 50);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201806', 'YYYYMM'), 150);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201807', 'YYYYMM'), 200);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201808', 'YYYYMM'), 500);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201809', 'YYYYMM'), 1000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201810', 'YYYYMM'), 2000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201811', 'YYYYMM'), 2500);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201812', 'YYYYMM'), 3000);

insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201901', 'YYYYMM'), 3000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201902', 'YYYYMM'), 4000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201903', 'YYYYMM'), 5000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201904', 'YYYYMM'), 5000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201905', 'YYYYMM'), 5000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201906', 'YYYYMM'), 15000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201907', 'YYYYMM'), 20000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201908', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201909', 'YYYYMM'), 10000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201910', 'YYYYMM'), 5000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201911', 'YYYYMM'), 10000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('201912', 'YYYYMM'), 20000);

insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202001', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202002', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202003', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202004', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202005', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202006', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202007', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202008', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202009', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202010', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202011', 'YYYYMM'), 125000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202012', 'YYYYMM'), 100000);

insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202101', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202102', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202103', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202104', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202105', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202106', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202107', 'YYYYMM'), 125000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202108', 'YYYYMM'), 150000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202109', 'YYYYMM'), 125000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202110', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202111', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202112', 'YYYYMM'), 50000);

insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202201', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202202', 'YYYYMM'), 5000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202203', 'YYYYMM'), 10000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202204', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202205', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202206', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202207', 'YYYYMM'), 225000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202208', 'YYYYMM'), 150000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202209', 'YYYYMM'), 125000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202210', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202211', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202212', 'YYYYMM'), 50000);

insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202301', 'YYYYMM'), 25000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202302', 'YYYYMM'), 50000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202303', 'YYYYMM'), 75000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202304', 'YYYYMM'), 100000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202305', 'YYYYMM'), 125000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202306', 'YYYYMM'), 150000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202307', 'YYYYMM'), 175000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202308', 'YYYYMM'), 200000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202309', 'YYYYMM'), 225000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202310', 'YYYYMM'), 250000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202311', 'YYYYMM'), 300000);
insert into public.udemy_sales (sales_date, sales_volume) values(to_date('202312', 'YYYYMM'), 450000);

select * from public.udemy_sales;