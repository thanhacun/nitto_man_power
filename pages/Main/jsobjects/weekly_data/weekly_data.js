export default {
	myFun1 () {
		//	write code here
		//	this.myVar1 = [1,2,3]
	},
	async myFun2 () {
		//	use async-await or promises
		//	await storeValue('varName', 'hello world')
	},
	daily_data: GetWorkers.data.list,
	
	draft_weekly_data: this.daily_data.map(e=>({
		week: e.Year + "-" + e.Month + "-W" + e.Week,
		workers: this.daily_data.filter(d => (d.Year === e.Year && d.Month === e.Month && d.Week === e.Week)).map(e1 => e1.Workers).reduce( (a, c) => (a + c))
	})),
	
	weekly_data: this.draft_weekly_data.filter( (e, index, self) => index === self.findIndex((t) => t.week === e.week))
}