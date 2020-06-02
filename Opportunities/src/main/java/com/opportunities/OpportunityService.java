package com.opportunities;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ResponseBody;


@Component
public class OpportunityService {

	@Autowired
	OpportunityDao dao;

	public void addOpportunity(Opportunity opportunity) {
		dao.save(opportunity);
	}

	public  List<Opportunity> getOpportunities() {

		return  dao.getAllOpportunities();
	}
	public void deleteCandidate(Integer id)
	{
		dao.deleteById(id);
	}
}
