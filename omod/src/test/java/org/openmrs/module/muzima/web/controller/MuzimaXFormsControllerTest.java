package org.openmrs.module.muzima.web.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openmrs.api.context.Context;
import org.openmrs.module.muzima.MuzimaXForm;
import org.openmrs.module.muzima.api.service.MuzimaFormService;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.junit.matchers.JUnitMatchers.hasItems;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@RunWith(PowerMockRunner.class)
@PrepareForTest(Context.class)
public class MuzimaXFormsControllerTest {
    private MuzimaXFormsController controller;
    private MuzimaFormService service;

    @Before
    public void setUp() throws Exception {
        service = mock(MuzimaFormService.class);
        controller = new MuzimaXFormsController();
        mockStatic(Context.class);
        PowerMockito.when(Context.getService(MuzimaFormService.class)).thenReturn(service);
    }

    @Test
    public void xForms_shouldReturnXForms() throws Exception {
        MuzimaXForm xForm1 = new MuzimaXForm() {{
            setId(1);
        }};
        MuzimaXForm xForm2 = new MuzimaXForm() {{
            setId(2);
        }};

        when(service.getXForms()).thenReturn(asList(xForm1, xForm2));

        assertThat(controller.xForms().size(), is(2));
        assertThat(controller.xForms(), hasItems(xForm1, xForm2));
    }

    @Test
    public void importXForm_shouldImportAnExistingXForm() throws Exception {
        controller.importXForm(1, "form", "discriminator");
        verify(service).importExisting(1,  "form",  "discriminator");
    }
}
