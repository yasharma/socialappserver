'use strict';
const moment = require('moment');

exports.termsConditionsTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			description: data[i].description,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-termsconditions/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-termsconditions/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.blogTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			title: data[i].title,
			type: data[i].type,
			slug: data[i].slug,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-blog/${data[i].slug}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-blog/${data[i].slug}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};

exports.userTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			customer_name: data[i].customer_name || '-',
			customer_url: data[i].customer_url || '-',
			email: data[i].email,
			mobile: data[i].mobile,  
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-user/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-info"></i>
						</a>
						<a href="#!/edit-user/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};

exports.faqTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			question: data[i].question,
			order: data[i].order,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-faq/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-faq/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
exports.testimonialTable = (status_list, recordsTotal, data, draw) => {
	
	let result = [];
	for (var i = data.length - 1; i >= 0; i--) {
		result[i] = {
			id:`<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">
					<input name="id[]" type="checkbox" class="checkboxes" value="${data[i]._id}"/>
					<span></span>
				</label>`,
			name: data[i].name,
			created_date: moment(data[i].created_at).format('MMM D, YYYY'),
			status: `<span class="label label-sm label-${status_list.class[data[i].status]}">${status_list.status[data[i].status]}</span>`,
			action: `
					<div class="btn-group btn-group-solid">
						<a href="#!/view-testimonial/${data[i]._id}" class="btn btn-sm btn-outline blue tooltips" data-original-title="View">
							<i class="fa fa-search"></i>
						</a>
						<a href="#!/edit-testimonial/${data[i]._id}" class="btn btn-sm btn-outline grey-salsa tooltips" data-original-title="Edit">
							<i class="fa fa-pencil"></i>
						</a>
					</div>`
		};
	}
	return {
		recordsTotal: recordsTotal,
		data: result,
		recordsFiltered: result.length,
		draw: draw
	};
};
