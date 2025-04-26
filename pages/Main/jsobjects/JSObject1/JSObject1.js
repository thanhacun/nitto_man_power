export default {
	MultiSelect1onOptionChange () {
		//	write code here
		console.log(MultiSelect1.selectedOptionLabels);
		const test1 = [1]
		const test = GetWorkers.data.list.filter(e => DatePicker1.formattedDate ? DatePicker1.formattedDate == e.Date : true && MultiSelect1.selectedOptionValues.length != 0 ? MultiSelect1.selectedOptionValues.includes(e['Sub-Contractors'].Id) : true);
		console.log(test);
	}
}