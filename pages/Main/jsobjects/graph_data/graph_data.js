export default {
	get_data: () => GetWorkers.data.list,
	daily_data: this.get_data(),

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
		return daily_options;
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
					"width": 200,
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
			"yAxis": [{"type": "value"}],
			"series":series.map(() => ({
				"type": "bar",
				"stack": "workers"
			})),
			"color": ["#14532d", "#15803d", "#22c55e", "#86efac", "#dcfce7"]  //will rotate between these colors
		}),
}