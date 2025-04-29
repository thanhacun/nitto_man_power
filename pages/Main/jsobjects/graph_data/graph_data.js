export default {
	get_data() {
		return GetWorkers.data.list.filter(r => this.filter(r));
	},
	
	daily_data: this.get_data().map(r => ({...r, Works: GetJobs.data.list.filter(j => r._nc_m2m_Actual_Works.map(o => o.Works_id).includes(j.Id)).map(f => f.Job)})),
	
	getCommonElement: (arr1, arr2) => {
		// return common items of 2 arrays (chatGPT)
		const set1 = new Set(arr1);
		return arr2.filter(item => set1.has(item));
	},
	
	filter: (r) => {
		const date_filter = DatePicker1.formattedDate ? r.Date == DatePicker1.formattedDate : true;
		const company_filter = ContractorSelect.selectedOptionValues.length ? ContractorSelect.selectedOptionValues.includes(r["Sub-Contractors_id"]) : true;
		const job_filter = TaskSelect.selectedOptionValues.length ? this.getCommonElement(r._nc_m2m_Actual_Works.map(o => o.Works_id), TaskSelect.selectedOptionValues).length : true;
		// console.log(date_filter, company_filter, job_filter);
		return date_filter && company_filter && job_filter;
	},
	
	draft_weekly_data: this.daily_data.map(e=>({
		week: e.Year + "-" + e.Month + "-W" + e.Week,
		workers: this.daily_data.filter(d => (d.Year === e.Year && d.Month === e.Month && d.Week === e.Week)).map(e1 => e1.Workers).reduce( (a, c) => (a + c))
	})),

	weekly_data: this.draft_weekly_data.filter( (e, index, self) => index === self.findIndex((t) => t.week === e.week)),
	
	graph_daily_data: () => {
		// return daily data grouping by sub-contractor and date
		const date_series = [...new Set(Actual_Workers.tableData.map(r => r.Date))];
		const company_series = [...new Set(Actual_Workers.tableData.map(r => r.Company))];
		let dataset_source = [["Date"].concat(company_series)];
		for (let date of date_series) {
			let date_data = [date];
			for (let company of company_series) {
				let company_workers = Actual_Workers.tableData.filter(r => r.Date == date && r.Company == company).map(f => f.Workers).reduce((a, v) => (a + v), 0);
				date_data.push(company_workers|| 0);
			};
			dataset_source.push(date_data);
		}
		const daily_options = this.echart_bar_options(dataset_source, "Nitto daily man power", company_series);
		// console.log(daily_options);
		return daily_options;
	},
	
	graph_weekly_data: () => {
		const week_series = this.weekly_data.map(r => r.week);
		let dataset_source = [['Week', 'Man Power', 'Man Power (line)']].concat(this.weekly_data.map(r => [r.week, r.workers, r.workers]));
		const weekly_options = this.echart_bar_options(dataset_source, "Nitto weekly man power", ['Man Power']);
		weekly_options.series.push({
			type: 'line',
			stack: 'workers'
		});
		weekly_options.legend.data = ['Man Power']
		return weekly_options;
	},
	
	echart_bar_options: (dataset=[], title="", series=[]) =>  ({
			"dataset": {"source": dataset},
			"tooltip": {
				"trigger": "axis",
				"axisPointer": {
					"type": "shadow"
				}
			},
			"title": {
				"text": title,
				"left": "center",
				"textStyle": {
					"width": 400,
					"overflow": "truncate"
				}
			},
			"legend": {
				"top": 40,
				"type": "scroll"
			},
			"grid": {
				"left": 15,
				"right": 15,
				"bottom": 30,
				"top": 100,
				"containLabel": true
			},
			"xAxis": [{"type": "category"}],
			"yAxis": [{"type": "value", "name": "Person"}],
			"series":series.map(() => ({
				"type": "bar",
				"stack": "workers"
			})),
			"color": ["#14532d", "#15803d", "#22c55e", "#86efac", "#dcfce7"]  //will rotate between these colors
		}),
}