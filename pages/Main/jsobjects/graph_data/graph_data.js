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
		const date_series = [...new Set(this.daily_data.map(r => r.Date))];
		const company_series = [...new Set(this.daily_data.map(r => r.Company))];
		let dataset_source = [["Date"].concat(company_series)];
		for (let date of date_series) {
			let date_data = [date];
			for (let company of company_series) {
				let company_workers = this.daily_data.filter(r => r.Date == date && r.Company == company).map(f => f.Workers).reduce((a, v) => (a + v), 0);
				date_data.push(company_workers|| 0);
			};
			dataset_source.push(date_data);
		}
		// console.log(company_series);
		
		const eChart_Configuration = {
			"dataset": {
				"source": dataset_source
			},
			"tooltip": {
				"trigger": "axis",
				"axisPointer": {
					"type": "shadow"
				}
			},
			"title": {
				"text": "Nitto daily man power",
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
			"xAxis": [
				{
					"type": "category"
				}
			],
			"yAxis": [
				{
					"type": "value"
				}
			],
			"series":company_series.map(() => ({
				"type": "bar",
				"stack": "workers"
			}))
		};
		return eChart_Configuration;
	},	
}