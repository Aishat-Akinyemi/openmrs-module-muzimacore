/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.muzima.web.controller;

import org.openmrs.api.context.Context;
import org.openmrs.module.muzima.api.service.GeneratedReportService;
import org.openmrs.module.muzima.api.service.ReportConfigurationService;
import org.openmrs.module.muzima.model.GeneratedReport;
import org.openmrs.module.muzima.model.ReportConfiguration;
import org.openmrs.module.muzima.web.utils.WebConverter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TODO: Write brief description about the class here.
 */
@Controller
public class GeneratedReportsController {

    @RequestMapping(value = "/module/muzimacore/generatedReports.json", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getGeneratedReports(final @RequestParam(value = "patientId") Integer patientId, final @RequestParam(value = "pageNumber") Integer pageNumber,
            final @RequestParam(value = "pageSize") Integer pageSize) {
        Map<String, Object> response = new HashMap<String, Object>();
        if (Context.isAuthenticated()) {
            GeneratedReportService generatedReportService = Context.getService(GeneratedReportService.class);
            int pages = (generatedReportService.countDataSource(patientId).intValue() + pageSize - 1) / pageSize;
            List<Object> objects = new ArrayList<Object>();
            for (GeneratedReport generatedReport : generatedReportService.getPagedGeneratedReports(patientId, pageNumber, pageSize)) {
                objects.add(WebConverter.convertMuzimaGeneratedReport(generatedReport));
            }
            response.put("pages", pages);
            response.put("objects", objects);
        }
      return response;
    }
    @RequestMapping(value = "/module/muzimacore/generatedReport.json", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getGeneratedReport(final @RequestParam(value = "patientId") Integer patientId,
            final @RequestParam(value = "cohortReportConfigId") Integer cohortReportConfigId) {
        Map<String, Object> response = new HashMap<String, Object>();
        if (Context.isAuthenticated()) {
            GeneratedReportService generatedReportService = Context.getService(GeneratedReportService.class);
            List<Object> objects = new ArrayList<Object>();
            objects.add(WebConverter.convertMuzimaGeneratedReport(generatedReportService.getGeneratedReportByPatientIdANDCohortReportConfigId(patientId,cohortReportConfigId)));
            
            response.put("objects", objects);
        }
        return response;
    }
}
