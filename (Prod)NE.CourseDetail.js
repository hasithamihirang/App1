/**
* @class NE.CourseDetail Course view
* @constructor
* @param {Object}
*            config Configuration options
* @author Jason Grigsby
* @version 1.0 translated
------------------------------------------------
*@Modified by : Shrideshi Samaraweera
*@Description : New Course Interface
*/
var loaded=0;
NE.CourseDetail = function (config) {

    // defaults
    this.cls = 'courseware-detail-panel';
    this.bodyCssClass = 'body';
    this.id = 'courseDetailWin';
    this.IsEnsembaRecommendation = false;
    this.EnsembaTopic = '';
    this.VideoRecordEnable = 0;
    this.addEvents({
        "addCourseEnrollment": true,
        "removeCourseEnrollment": true,
        "resetCourseCompletion": true,
        "submitStudentChecklist": true
    });

    if (config.certRecord) {
        this.certId = config.certRecord.get('certId');
        this.certStatus = config.certRecord.get('certStatus');
        this.displayCoursesIndividually = !!config.certRecord.get('displayCoursesIndividually');
        this.certHasPrice = !!config.certRecord.get('certHasPrice');
    }
    else {
        this.certId = 0 ;
        this.certStatus = '';
        this.displayCoursesIndividually =null;
        this.certHasPrice = null;
    }
    // call parent constructor
    NE.CourseDetail.superclass.constructor.call(this, config);

}

that = this;

Ext.extend(NE.CourseDetail, NE.DetailPanel, {

    // private
    initComponent: function(ct, position) {

        Ext.Component.on({
            'examComplete': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },
            'scormCommit': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },
            'updateLessonStatus': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },
            'addCourseEnrollment': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },
            'removeCourseEnrollment': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },

            'resetCourseCompletion': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },

            'submitStudentChecklist': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },

            'SubmitLessonSurvey': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },

            'vidyardVideoClosed': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            },
           'surveyComplete': function() {
                if (!this.isDestroyed) {
                    that.refresh();
                }
            }

           
        });

        this.pbar = new Ext.ProgressBar();
        this.pbar.boxMaxHeight = 18;
        this.pbar.boxMinHeight = 18;
        var localScope = this;
        this.pbar.on('render', function() {
            var boxWidth = localScope.pbar.getWidth() - 13;
            localScope.pbar.boxMinWidth = boxWidth;
        });

        this.addActions();

        var autoPlay = this.autoPlay;


        // create the panels to put in column
        this.avgRating = new NE.CourseAvgRating({
            title: SYS.localeMgr.getString('AVERAGE_RATING', NE.consts.TEMPLATEID_COURSE, 'Average Rating'),
            bodyStyle: 'padding: 6px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true,
            id: 'avgRatingPanel' //ARR-611-41787

        });

        this.yourRating = new NE.CourseUserRating({
            title: SYS.localeMgr.getString('YOUR_RATING', NE.consts.TEMPLATEID_COURSE, 'Your Rating'),
            courseId: this.courseId,
            bodyStyle: 'padding: 6px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true,
            id: 'courseRatingPanel'
        });

        this.scorePanel = new Ext.Panel({
            hidden: true,
            title: SYS.localeMgr.getString('SCORE', NE.consts.TEMPLATEID_COURSE, 'Score'),
            courseId: this.courseId,
            bodyStyle: 'padding: 6px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true,
            id: 'courseScorePanel'
        });

        this.prerequisitesPanel = new NE.CoursePrerequisites({
            courseId: this.courseId,
                    id:'coursePrerequisiesPanel',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            hidden: true,
            collapsible: true
        });

        // the following panels are only made visible if their data is available (if enrolled)
        this.extendedDetailPanel = new NE.CourseExtendedDetails({
            courseId: this.courseId,
            hidden: true,
            bodyStyle: 'padding: 10px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true
        });

        this.courseOutline = new Ext.Panel({
            title: SYS.localeMgr.getString('COURSE_DETAILS', NE.consts.TEMPLATEID_COURSE, 'Course Details'),
            hidden: true,
            bodyStyle: 'padding: 10px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true
        });

        this.dateEnrolledPanel = new Ext.Panel({
            title: SYS.localeMgr.getString('DATE_ENROLLED', NE.consts.TEMPLATEID_COURSE, 'Date Enrolled'),
            hidden: true,
            bodyStyle: 'padding: 10px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true,
            id: 'courseDateEnrolledPanel'

        });

        this.courseSuccessStatusPanel = new Ext.Panel({
            title: SYS.localeMgr.getString('COURSE_SUCCESS_STATUS', NE.consts.TEMPLATEID_COURSE, 'Success Status'),
            hidden: true,
            bodyStyle: 'padding: 10px 0 0 7px;',
            collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
            collapsible: true
        });

        //XNG-775-54259 : Shrideshi
        this.dateEnrolledDuedatePanel = new Ext.Panel({
            hidden: true,
            cls: 'course_details_import_dates',
            title: SYS.localeMgr.getString('IMPORTANT_DATES', NE.consts.TEMPLATEID_COURSE, 'Important Dates'),
            collapsible: false,
            layout: 'column',
            items: [{
                columnWidth: 0.45,
                style: parseInt(SYS.cookieMgr.get('responsive')) && NE.cfg.isMobileDevice ? 'text-align: left;' : 'text-align: right;'
            }, {
                columnWidth: parseInt(SYS.cookieMgr.get('responsive')) && NE.cfg.isMobilePhone ? 0.40 : 0.55
}]
            });

            this.descriptionPanel = new Ext.Panel({
                title: SYS.localeMgr.getString('DESCRIPTION', NE.consts.TEMPLATEID_COURSE, 'Description'),
                hidden: true,
                bodyStyle: 'padding: 10px 0 0 7px;',
                bodyCssClass: 'courseExtendedDetails',
                collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' && NE.user.companyId != 11005 ? true : false,
                collapsible: true,
                id: 'courseDescriptionPanel'
            });

            this.requirementsPanel = new Ext.Panel({
                title: SYS.localeMgr.getString('REQUIREMENTS_FOR_COMPLETION', NE.consts.TEMPLATEID_COURSE, 'Requirements for Completion'),
                hidden: true,
                bodyStyle: 'padding: 10px 0 0 7px;',
                collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
                collapsible: true,
                id: 'courseRequirementsPanel'
            });

            this.languagePanel = new Ext.Panel({
                title: SYS.localeMgr.getString('COURSE_LANGUAGE', NE.consts.TEMPLATEID_COURSE, 'Course Language'),
                hidden: true,
                bodyStyle: 'padding: 10px 0 0 7px;',
                collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
                collapsible: true
            });

            this.pricePanel = new Ext.Panel({
                title: SYS.localeMgr.getString('PRICE', NE.consts.TEMPLATEID_COURSE, 'Price'),
                bodyStyle: 'color:#280;padding: 10px 0 0 7px;',
                hidden: true,
                collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
                collapsible: true,
                id: 'coursePricePanel'
            });

            this.progressPanel = new Ext.Panel({
                title: SYS.localeMgr.getString('TRACK_PROGRESS', NE.consts.TEMPLATEID_COURSE, 'Track Your Progress'),
                bodyStyle: 'color:#280;padding: 10px 0 0 7px;',
                hidden: true,
                collapsible: false,
                id: 'progressPanel'
            });


            this.courseExpirationPanel = new Ext.Panel({
                title: SYS.localeMgr.getString('COURSE_EXPIRATION', NE.consts.TEMPLATEID_COURSE, 'Course Expiration Details'),
                bodyStyle: 'color:orange;padding: 10px 0 0 7px;',
                hidden: true,
                collapsed: SYS.cookieMgr.get('NewCoursePage') == 'true' ? true : false,
                collapsible: true
            });

            this.imagePanel = new Ext.Panel({
                hidden: true,
                header: false,
                id: 'courseImagePanel'
            });

        var that = this;
        this.contestDetailPanel = new Ext.Panel({
            hidden: true,
            title: SYS.localeMgr.getString('CONTEST_DETAILS', NE.consts.TEMPLATEID_COURSE, 'Contest Details'),
            cls: 'pnl-contestdetail',
            border: false,
            frame: false,
            listeners: {
                afterrender: function (panel) {

                    panel.body.on('click', function (e) {

                        e.preventDefault();
                        if (e.getTarget('.dv-winners')) {

                        
                            var winners = that.courseDetails.Winners;
                            var arrwinners = winners.split(',')
                            var htmlstring = "";

                            if (that.courseDetails.Winners) {
                                htmlstring = arrwinners.join(" </br> ");
                               
                            }
                            else {
                                htmlstring = SYS.localeMgr.getString('NO_WINNERS', NE.consts.TEMPLATEID_COURSE, 'No Winners');
                            }
                            if (this.WinnerWindow) {
                                this.WinnerWindow.destroy();
                            }
                            this.WinnerWindow = new Ext.Window({
                                bodyStyle: 'background:#FFF;',
                                title: SYS.localeMgr.getString('WINNERS', NE.consts.TEMPLATEID_COURSE, 'Winners'),
                                cls: 'winnersWindow',
                                html: htmlstring,
                                pageX: e.getPageX(),
                                pageY: (e.getPageY() - 150),
                                height: 200,
                                width: 300,
                                layout: 'fit',
                                modal: false,
                                closable: true,
                                resizable: false,
                                draggable: true
                            });

                            this.WinnerWindow.show();
                        }
                    });
                }
            }


        });
            //XNG-775-54259 by Shrideshi
            if (SYS.cookieMgr.get('bNewDescriptionPanel') == 'true') {
                // add to column item collection
                this.columnItems = [

                    this.dateEnrolledDuedatePanel,
                    this.progressPanel,
                    this.pricePanel,
                    this.dateEnrolledPanel,
                    this.courseSuccessStatusPanel,
                    this.requirementsPanel,
                    this.prerequisitesPanel,
            this.imagePanel,
                    this.descriptionPanel,
                    this.languagePanel,
                    this.courseOutline,
                    this.extendedDetailPanel,
                    this.courseExpirationPanel,
                    this.avgRating,
                    this.yourRating,
                    this.scorePanel,
                    this.contestDetailPanel
					];
            }
            else {
                this.columnItems = [

                    this.dateEnrolledDuedatePanel,
                    this.imagePanel,
            this.progressPanel,
            this.pricePanel,
            this.dateEnrolledPanel,
            this.courseSuccessStatusPanel,
            this.avgRating,
            this.yourRating,
            this.requirementsPanel,
            this.prerequisitesPanel,
            this.descriptionPanel,
            this.languagePanel,
            this.courseOutline,
            this.extendedDetailPanel,
                    this.courseExpirationPanel,
                    this.scorePanel];
            }


            //create main panel, pass in a reference to this panel

//if (!(this.courseDetails.examAvailability && NE.user.companyId == 10229)) {
                this.courseLession = new NE.CourseLessons({ detailPanel: this, courseId: this.courseId, id: 'courseLessons', resourceAvailable: 1, autoPlay: autoPlay });
            //}
            //this.courseLession = new NE.CourseLessons({ detailPanel: this, courseId: this.courseId, id: 'courseLessons', resourceAvailable: 1, autoPlay: autoPlay });


            var courseLessonWidth = Ext.getCmp('courseLessons');


            this.takeExamActionBottom = new Ext.Button({
                text: SYS.localeMgr.getString('TAKE_EXAM1233', NE.consts.TEMPLATEID_COURSE, '<span class="button-text" style=" text-align:left !important">Take Exam</span>  <span  style="align:right;"> You must complete all lessons to access exam </span>'),
                handler: this.proctorKeyValidation,
                id: 'takeExamActionBottom',
                cls: 'lesson-bbar-button',
                clickEvent: 'click',
                scope: this,
                scale: 'large',
                //autoWidth: true,
                style: 'margin:8px 4px 0 8px;',
                disabled: true



            });



            this.takeSurveyActionBottom = new Ext.Button({
                text: SYS.localeMgr.getString('TAKE_SURVEY', NE.consts.TEMPLATEID_COURSE, 'Take Survey'),
                handler: this.takeSurvey,
                scope: this,
                //hidden: true,
                scale: 'large',
                //autoWidth: true,
                style: 'margin:8px 4px 0 8px;width:500px;',
                cls: 'lesson-bbar-button',
                disabled: true
            });

                   // this.footerButtonsPanel = new Ext.Panel({
                       // header: false,
                       // items: [this.takeExamActionBottom],
                      //  bodyStyle: 'border: 0;background:none;font: 12px arial width:100%;',
                      //  baseCls: 'fullwidth',
                      //  id: 'footerButtonsPanel'


        if (SYS.cookieMgr.get('companyId') == "11019" || SYS.cookieMgr.get('companyId') == "11121") {

            var newobj = this;
            this.newExamUI = new Ext.Panel(
                                                    {
                                                        id: "newExamUI",
                                                        header: false,
                                                        html: '<div id ="divNewExamButtonUI"><span class="takeExamTextSpan">' + SYS.localeMgr.getString('TAKE_EXAM', NE.consts.TEMPLATEID_COURSE, 'Take Exam') + '</span><span id ="spnNewexamIcon"><img src ="https://v6.netexam.com/images/TakeExamNewIcon.png" width= "80px" height ="80px"/></span></div>',
                                                        style: 'margin:8px 4px 0 8px',
                                                        hidden: true,
                                                        listeners: {
                                                            render: function (c) {
                                                                c.body.on('click', function () {

                                                                    newobj.proctorKeyValidation();
                                                                }
                                                               );
                                                            },
                                                            scope: this
                                                        }
                                                    });

            this.mainCoursePanel = new Ext.TabPanel({
                id: 'maintabpanel',
                items: [this.courseLession],
                activeTab: 0,
                tabPosition: 'top',
                frame: true,
                style: 'margin:8px 4px 0 8px'

            });

            this.mainPanel = new Ext.Panel({
                id: 'mainPanelCourse',
                border: false,
                items: [this.mainCoursePanel, this.newExamUI]
            });
        }

        else {

            this.mainPanel = new Ext.TabPanel({
                id: 'maintabpanel',
                items: [this.courseLession],
                activeTab: 0,
                tabPosition: 'top',
                frame: true,
                style: 'margin:8px 4px 0 8px'

            });
        }
        //XNG-775-54259 by Shrideshi
        this.newDescriptionPanel = new Ext.Panel({
            id: 'descriptionPanel',
            bodyStyle: 'padding: 10px 0 0 7px;',
            style: 'margin:4px 4px 0 8px',
            border: false,
            hidden: true,
            bodyCssClass: 'courseExtendedDetails'
        });

        //NHF - 400 - 22682
        if (SYS.cookieMgr.get('companyId') == "10229" || SYS.cookieMgr.get('companyId') == "11181") {
            this.MsgNewVersion = new Ext.Panel({
                id: 'new-version-msg',
                html: '<p align="center">Please allow the following URL in your popup blocker: infocommuniversity.kenexa.com</p>',
                bodyStyle: 'padding: 10px 0 0 7px;',
                style: 'margin:4px 4px 0 8px',
                border: false,
                hidden: false,
                bodyCssClass: 'courseExtendedDetails',
                listeners: {
                    render: function (c) {
                        c.body.on('click', function (e, o) {
                            if (e.getTarget('.enroll-btn')) {
                                var courseId = o.id;
                                NE.app.launchDirectLink('#:cs' + courseId + ":autoenroll=1");
                            }
                        });
                    },
                    scope: this
                }
            });
        }
        else {
            this.MsgNewVersion = new Ext.Panel({
                id: 'new-version-msg',
                bodyStyle: 'padding: 10px 0 0 7px;',
                style: 'margin:4px 4px 0 8px',
                border: false,
                hidden: true,
                bodyCssClass: 'courseExtendedDetails',
                listeners: {
                    render: function(c) {
                        c.body.on('click', function(e, o) {
                            if (e.getTarget('.enroll-btn')) {
                                var courseId = o.id;
                                NE.app.launchDirectLink('#:cs' + courseId + ":autoenroll=1");
                            }
                        });
                    },
                    scope: this
                }
            });
        }

        this.discussionPanel = NE.discussionPanel = new SYS.DiscussionPanel({ collapsible: true, courseId: this.courseId, hidden: true });
        if (SYS.cookieMgr.get('companyId') == "11019" || SYS.cookieMgr.get('companyId') == "11121") {
            Ext.extend(this.mainCoursePanel, Ext.TabPanel, {


                onClick: function (e, target) {
                    //e.stopEvent();
                    if (target.href && !/.*\-(tab|form|no-link)\-.*/.test(target.className)) {
                        this.load(target.href);
                    }
                }
            });

        }
        else {
            Ext.extend(this.mainPanel, Ext.TabPanel, {


                onClick: function(e, target) {
                    //e.stopEvent();
                    if (target.href && !/.*\-(tab|form|no-link)\-.*/.test(target.className)) {
                        this.load(target.href);
                    }
                }
            });

        }
        //this.discussionPanel = NE.discussionPanel = new SYS.DiscussionPanel({collapsible: true, courseId: this.courseId});

            // call parent initComponent
            NE.CourseDetail.superclass.initComponent.call(this, ct, position);

            this.mainColumn.add(this.discussionPanel);
            // if (NE.user.companyId == 10229) {
            // this.mainColumn.add(this.form_selfRegister);
            //  }

        },

        addActions: function() {
            //XNG-775-54259 by Shrideshi

            var supportEmailAddress = SYS.cookieMgr.get('SupportEmail');

            this.helpLink = new Ext.BoxComponent({

                autoEl: { tag: 'a',
                    href: 'mailto:' + supportEmailAddress + '?Subject=Training Support Inquiry',
                    html: SYS.localeMgr.getString('HELP_LINK', NE.consts.TEMPLATEID_COURSE, 'Need Help?')

                },
                cls: 'help-link',
                scope: this,
                hidden: true
            });

            this.approvalDenies = new Ext.form.Label({
                text: SYS.localeMgr.getString('APPOVAL_DENIED', NE.consts.TEMPLATEID_COURSE, 'Approval Denied'),
                cls: 'approval-denied',
                scope: this,
                hidden: true

            });



            this.unEnrollAction = new Ext.Button({
                text: SYS.localeMgr.getString('UNENROLL', NE.consts.TEMPLATEID_COURSE, 'Unenroll'),
                iconCls: 'icon-unenroll-32',
                handler: this.removeCourseEnrollment,
                scope: this,
                hidden: true,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });

            this.enrollAction = new Ext.Button({
                text: SYS.localeMgr.getString('ENROLL', NE.consts.TEMPLATEID_COURSE, 'Enroll'),
                iconCls: 'icon-enroll-32',
                handler: this.addCourseEnrollment,
                scope: this,
                hidden: true,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });


            // this button uses click (aka mouseup) else it refocuses the window over the launched exam window
            this.takeExamAction = new Ext.Button({
                text: SYS.localeMgr.getString('TAKE_EXAM', NE.consts.TEMPLATEID_COURSE, 'Take Exam'),
                iconCls: 'icon-exam-32',
                hidden: true,
                handler: this.proctorKeyValidation,
                clickEvent: 'click',
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });

        this.takeFlashCardsAction = new Ext.Button({
            text: SYS.localeMgr.getString('FLASH_CARDS', NE.consts.TEMPLATEID_COURSE, 'Flash Cards'),
            iconCls: 'icon-exam-32',
            // hidden: false,
            handler: this.launchFlashCards,
            clickEvent: 'click',
            scope: this,
            scale: 'large',
            iconAlign: 'top',
            width: 86,
            cls: 'toolbar-icon-large'
        });
            // this button uses click (aka mouseup) else it refocuses the window over the launched exam window
            this.scheduleProctoredExamAction = new Ext.Button({
                text: SYS.localeMgr.getString('SCHEDULE_PROCTORED_EXAM', NE.consts.TEMPLATEID_COURSE, 'Schedule and Start Proctored Exam Session'),
                iconCls: 'icon-schedule-exam-32',
                hidden: true,
                handler: this.launchScheduleProctoredExam,
                clickEvent: 'click',
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });

            this.examResultsAction = new Ext.Button({
                text: NE.cfg.isMobilePhone && parseInt(SYS.cookieMgr.get('responsive')) ? SYS.localeMgr.getString('VIEW_EXAM_RESULTS_MOBILE', NE.consts.TEMPLATEID_CERT, 'Results') : SYS.localeMgr.getString('VIEW_EXAM_RESULTS', NE.consts.TEMPLATEID_CERT, 'View exam results'),
                iconCls: 'icon-exam-results-32',
                hidden: true,
                clickEvent: 'click',
                handler: function() {

                    SYS.localeMgr.cacheTemplate(NE.consts.TEMPLATEID_EXAM, function() {
                        this.languageId = this.courseLession.languageId;
                        var examResults = new NE.ExamResults({
                            examId: this.courseDetails.examId,
                            proctorKey: this.courseDetails.proctorKey,
                            languageId: this.languageId,
                            examName: this.courseDetails.ExamName

                        });

                        var vpSize = Ext.getBody().getViewSize();
                        var winWidth = Math.round(vpSize.width * 0.9);
                        var winHeight = Math.round(vpSize.height * 0.95);

                        var win = new Ext.Window({
                            title: SYS.localeMgr.getString('RESULTS', NE.consts.TEMPLATEID_COURSE, 'Results'),
                            modal: true,
                            layout: 'fit',
                            id: 'resultsWindow',
                            items: examResults,
                            height: winHeight,
                            width: winWidth,
                            closable: true,
                            resizable: false,
                            draggable: false

                        });

                        win.show();

                    }, this);
                },
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 106,
                cls: 'toolbar-icon-large'
            });

            this.addToLinkedInAction = new Ext.Button({
                text: SYS.localeMgr.getString('ADD_TO_LINKED_IN', NE.consts.TEMPLATEID_COURSE, 'Add To LinkedIn'),
                iconCls: 'icon-linked-in-32',
                hidden: true,
                clickEvent: 'click',
                handler: function() {

                    window.open(this.courseDetails.certFile + "&pfCertificationName=" + this.courseDetails.name + "&trk=onsite_longurl");
                },
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 106,
                cls: 'toolbar-icon-large'
            });

            this.viewCertificateAction = new Ext.Button({
                text: SYS.localeMgr.getString('VIEW_CERTIFICATE', NE.consts.TEMPLATEID_COURSE, 'View Certificate'),
                iconCls: 'icon-certification-32',
                width: 86,
                handler: this.viewCertificate,
                scope: this,
                hidden: true,
                scale: 'large',
                iconAlign: 'top',
            cls: 'toolbar-icon-large btnViewCertificate'
           //id:'btnViewCertificate'		
            });

        this.publicSharingAction = new Ext.Button({
            text: SYS.localeMgr.getString('PUBLIC_SHARING', NE.consts.TEMPLATEID_COURSE, 'Public Sharing'),
            iconCls: 'icon-publicSharing-32',
            width: 86,
            handler: this.viewPublicSharing,
            scope: this,
            hidden: true,
            scale: 'large',
            iconAlign: 'top',
            cls: 'toolbar-icon-large btnPublicSharing'
            //id:'btnPublicSharing'	
        });

        this.shareBadgeAction = new Ext.Button({
            text: SYS.localeMgr.getString('SHARE_BADGE', NE.consts.TEMPLATEID_COURSE, 'Share Badge'),
            //iconCls: 'icon-publicSharing-32',
            width: 86,
            handler: this.viewShareBadge,
            scope: this,
            hidden: true,
            scale: 'large',
            iconAlign: 'top',
            cls: 'toolbar-icon-large btnViewBadge'
            // id: 'btnViewBadge'
        });

            this.userFileUpload = new Ext.Button({

                text: SYS.localeMgr.getString('FILE_UPLOAD', NE.consts.TEMPLATEID_COURSE, 'File Upload'),
                iconCls: 'icon-file-upload-32',
                hidden: true,
                clickEvent: 'click',
                handler: function() {
                    SYS.localeMgr.cacheTemplate(NE.consts.TEMPLATEID_COURSE, function() {


                        var fileUpload = new NE.UserFileUpload({
                            courseId: this.courseId,
                            VideoRecordEnable: this.VideoRecordEnable
                        });

                        var vpSize = Ext.getBody().getViewSize();
                        var winWidth = Math.round(vpSize.width * 0.5);
                        var winHeight = Math.round(vpSize.height * 0.55);

                        var winUpload = new Ext.Window({
                            title: SYS.localeMgr.getString('FILE_UPLOAD', NE.consts.TEMPLATEID_COURSE, 'File Upload'),
                            modal: true,
                            layout: 'fit',
                            id: 'uploadWindow',
                            items: fileUpload,
                            height: winHeight,
                            width: NE.cfg.isMobileDeviceLowRes && parseInt(SYS.cookieMgr.get('responsive')) ? NE.cfg.currentViewWidth * .95 : winWidth,
                            closable: true,
                            resizable: false,
                            draggable: false
                        }
                    );

                        winUpload.show();

                    },
                this
                );
                },
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 106,
                cls: 'toolbar-icon-large'

            }
        );

            this.takeSurveyAction = new Ext.Button({
                text: SYS.localeMgr.getString('TAKE_SURVEY', NE.consts.TEMPLATEID_COURSE, 'Take Survey'),
                iconCls: 'icon-survey-32',
                width: 86,
                handler: this.takeSurvey,
                scope: this,
                hidden: true,
                scale: 'large',
                iconAlign: 'top',
                cls: 'toolbar-icon-large'
            });

            this.addToCartAction = new Ext.Button({
                text: SYS.localeMgr.getString("ADD_TO_CART", NE.consts.TEMPLATEID_COURSE, 'Add to Cart'),
                iconCls: 'icon-cart-32',
                handler: this.addToCart,
                scope: this,
                hidden: true,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });

            this.retakeCourse = new Ext.Button({
                text: SYS.localeMgr.getString('RETAKE_COURSE', NE.consts.TEMPLATEID_COURSE, 'Ratake Course'),
                iconCls: 'icon-course-retake',
                hidden: true,
                handler: this.resetCourseCompletion,
                clickEvent: 'click',
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });

            this.rePrintReceiptAction = new Ext.Button({
                text: 'Reprint the receipt',
                iconCls: 'icon-print-32',
                handler: this.rePreintReceipt,
                scope: this,
                hidden: true,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });


            this.viewCheckList = new Ext.Button({
                text: SYS.localeMgr.getString('VIEW_CHECKLIST', NE.consts.TEMPLATEID_COURSE, 'CheckList'),
                iconCls: 'icon-course-checklist',
                hidden: true,
                handler: this.viewCheckListAction,
                clickEvent: 'click',
                scope: this,
                scale: 'large',
                iconAlign: 'top',
                width: 86,
                cls: 'toolbar-icon-large'
            });





            this.preReqMsg = new Ext.Toolbar.TextItem({
                hidden: true,
                text: String.format(
                '<span style="color:#C45A5A;">{0}</span>',
                SYS.localeMgr.getString("PREREQS_NOT_MET", NE.consts.TEMPLATEID_COURSE, 'Prerequisites not yet met')
            )
            });



            this.actions = [

            this.helpLink,
            this.approvalDenies,
            this.enrollAction,
            this.unEnrollAction,
            this.addToCartAction,
            this.takeSurveyAction,
            this.userFileUpload,
            this.takeExamAction,
            this.scheduleProctoredExamAction,
            this.examResultsAction,
            this.viewCertificateAction,
            this.rePrintReceiptAction,
            this.addToLinkedInAction,
            this.preReqMsg,
            this.retakeCourse,
			this.viewCheckList,
            this.publicSharingAction,
            this.shareBadgeAction,
            this.takeFlashCardsAction
            ];
        },

        takeSurvey: function(RequiredSurveyComplete) {

            if (RequiredSurveyComplete != true) {
                RequiredSurveyComplete = false;
            }
            SYS.localeMgr.cacheTemplate(NE.consts.TEMPLATEID_EXAM, function() {
                var win = new NE.Survey({
                    courseId: this.courseId,
                    modal: false,
                    width: 900,
                    height: 550,
                    RequiredSurveyComplete: RequiredSurveyComplete
                    //autoScroll: true
                });
                win.show();
                //this.ownerCt.close();
            }, this);
        },

            addToCart: function () {
        //display pop up before item added to cart - infoComm

        SYS.localeMgr.cacheTemplate(NE.consts.TEMPLATEID_ECOMMERCE, function () {
            if ((NE.user.companyId == 11126 || NE.user.companyId == 11181) && this.courseDetails.isDisplayPopupWindow) {

var courseId = this.courseId;
var that = this;
                Ext.Msg.show({
                    title: 'WARNING',
					width: NE.cfg.isMobilePhone && parseInt(SYS.cookieMgr.get('responsive')) ? NE.cfg.currentViewWidth * .90 : 'auto',
		    cls: 'addtoCartPreMsg',	
                    msg: SYS.localeMgr.getString('ADD_CART_ITEM_PREMESSAGE', NE.consts.TEMPLATEID_ECOMMERCE, 'SPECIAL ACCOMMADATIONS <br/>If you require Special Accommadations, you cannot register online for an exam.'),
                     buttons: {                        
                        no: SYS.localeMgr.getString('YES_ADD_CART_ITEM_PREMESSAGE', NE.consts.TEMPLATEID_PROFILE, '<table style="width: 100%;background:#fbb10b;;height:30px;color:black;font-size:14px;"><tbody><tr style="background:#fbb10b;height:30px;color:black;font-size:14px;"><td style="background:#fbb10b;height:30px;color:black;font-size:14px;font-weight:bold">Yes, I require Special Accommadations</td></tr></tbody></table>'),
                        yes: SYS.localeMgr.getString('NO_ADD_CART_ITEM_PREMESSAGE', NE.consts.TEMPLATEID_CLASS, '<table style="width: 100%;background:#22a2d5;height:30px;color:white;font-size:14px;"><tbody><tr style="background:#22a2d5;height:30px;color:white;font-size:14px;"><td style="background:#22a2d5;height:30px;color:white;font-size:14px;font-weight:bold">No, I dont require Special Accommadations</td></tr></tbody></table>'),
                    },
                    fn: function(button) {
                        if (button == 'yes') {
                            var cart = new NE.CartView();

                            var vpSize = Ext.getBody().getViewSize();
                            var winWidth = Math.round(vpSize.width * 0.9);
                            var winHeight = Math.round(vpSize.height * 0.95);
                            var win = new Ext.Window({
                                width: Math.min(900, winWidth),
                                height: winHeight,
                                items: cart,
                                layout: 'fit',
                                modal: true,
                                maximizable: true,
                                cls: 'lite-window scrollable-window'
                            });
                            win.show();

                            win.on('close', function () {
                                var tokenDelimiter = ':';
                                var activeItem = Ext.getCmp('center-panel').layout.activeItem;

                                if (activeItem) {
                                    Ext.History.add(activeItem.ownerCt.id + tokenDelimiter + activeItem.id);
                                }
                                else {
                                    NE.viewport.addHomeCard();
                                }
                            }, that);

                            cart.addCartItem({
                                coursewareType: NE.consts.COURSEWARETYPE_COURSE,
                                coursewareId: courseId,
                                isSecondaryVanue: false
                            });
                            that.ownerCt.destroy();
                        }
                      }
                        
                   }, that);
            }

            else {
                var cart = new NE.CartView();

                var vpSize = Ext.getBody().getViewSize();
                var winWidth = Math.round(vpSize.width * 0.9);
                var winHeight = Math.round(vpSize.height * 0.95);
                var win = new Ext.Window({
                    width: Math.min(900, winWidth),
                    height: winHeight,
                    items: cart,
                    layout: 'fit',
                    modal: true,
                    maximizable: true,
                    cls: 'lite-window scrollable-window'
                });
                win.show();

                win.on('close', function () {
                    var tokenDelimiter = ':';
                    var activeItem = Ext.getCmp('center-panel').layout.activeItem;

                    if (activeItem) {
                        Ext.History.add(activeItem.ownerCt.id + tokenDelimiter + activeItem.id);
                    }
                    else {
                        NE.viewport.addHomeCard();
                    }
                }, this);

                cart.addCartItem({
                    coursewareType: NE.consts.COURSEWARETYPE_COURSE,
                    coursewareId: this.courseId,
                    isSecondaryVanue: false
                });
                this.ownerCt.destroy();
            }

        }, this);
    },

        viewCertificate: function() {
            // make ajax call to GenerateCourseCertificate
            Ext.Ajax.request({
                params: {
                    op: 'GenerateCourseCertificate',
                    courseId: this.courseId
                },
                callback: function(scope, success, response) {
                    if (success) {
                        var certFileName = Ext.util.JSON.decode(response.responseText).d;
                        window.open(NE.cfg.certPath + certFileName);
                    }
                    else {
                        NE.app.reloadWebsiteOnError();
                    }
                },
                scope: this
            });

        },
    viewPublicSharing: function () {
        var obj = this;
        Ext.Ajax.request({
            params: {
                op: 'AddUserBadgeToken',
                coursewareId: this.courseId,
                coursewareType: "Course"
            },
            callback: function (scope, success, response) {
                if (success) {
                    var responseObject = Ext.util.JSON.decode(response.responseText).d;
                    var badgetoken = responseObject.userBadgeToken;
                    
                    //                    var PublicSharing = new NE.PublicSharing({
                    //                        tkn: badgetoken
                    //                    });

                    //                    var vp = new Ext.Window({
                    //                        maximized: true,
                    //                        closable: false,
                    //                        layout: 'fit',
                    //                        autoScroll: true,
                    //                        items: PublicSharing

                    //                    });
                    //                    vp.show();
                    //                    console.log('window.location.hash');
                    var link = window.location.origin + '/';    //var link = window.location.href.substr(0, window.location.href.indexOf('#'));
                    link = link + "?public=" + badgetoken;
                    window.open(link,"_blank");
                    
                }
            }
        });



    },

viewShareBadge : function() {
this.ownerCt.destroy();
	NE.viewport.addProfileCard();

},

        rePreintReceipt: function() {

            Ext.Ajax.request({
                params: {
                    op: 'GetOrdersDetailForReceiptRePrint',
                    courseId: this.courseId
                },
                success: function(response, options) {
                    var orderDetails = Ext.util.JSON.decode(response.responseText).d;
                    if (typeof (orderDetails) == 'undefined' || orderDetails == null) {
                        Ext.Msg.show({
                            title: 'Information',
                            msg: SYS.localeMgr.getString('NO_ORDER_DETAIL_FOUND', NE.consts.TEMPLATEID_COURSE, 'No order details found to print.. '),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                    else {
                        var rePrint = new NE.RePrintReceipt({
                            purchaseDate: orderDetails.DateCreated,
                            orderId: orderDetails.OrderID,
                            total: orderDetails.OrderTotal,
                            currency: orderDetails.Currency,
                            billToName: orderDetails.BillToName
                        });
                        var vpSize = Ext.getBody().getViewSize();
                        rePrint.setPosition(Math.round((vpSize.width / 2) - 200), 50);
                        rePrint.show();

                    }
                },
                scope: this
            });


        },


        proctorKeyValidation: function() {
            var proctorKey = this.courseDetails.proctorKey;
            var me = this;
            if (proctorKey != 0) {
                //Ext.MessageBox.getDialog().body.child('input').dom.type = 'password';
                Ext.Msg.passwordPrompt('Prompt', 'Please enter Proctor Key:', function(btn, text) {
                    if (btn == 'ok') {
                        if (text == proctorKey) {
                            me.checkTermsAndCondition();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: 'Incorrect Proctor Key!',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });
                        }
                    }
                });

            }
            else {
                me.checkTermsAndCondition();
            }
        },

        checkTermsAndCondition: function() {
            var enableTermsCondition = this.courseDetails.enableTermCondition;
            var isFirstAttempt = this.courseDetails.isFirstAttempt;


            if (enableTermsCondition && isFirstAttempt) {

                var termsAndCondionsText = this.courseDetails.termCondition;
                var cmp = this;

                var agreement = new Ext.Window({
                    title: SYS.localeMgr.getString('TERMS_AND_CONDITIONS', NE.consts.TEMPLATEID_COURSE, 'Terms and Conditions'),
                    id: 'termsCondionWindow',
                    width: NE.cfg.isMobilePhone && parseInt(SYS.cookieMgr.get('responsive')) ? NE.cfg.currentViewWidth * 0.9 : 500,
                    height: NE.cfg.isMobilePhone && parseInt(SYS.cookieMgr.get('responsive')) ? NE.cfg.currentViewHeight * 0.9 : 500,
                    bodyStyle: 'padding:5px;background:#FFF;',
                    autoScroll: true,
                    closable: false,
                    draggable: false,
                    modal: true,
                    items: [{
                        bodyStyle: 'margin-bottom:0px;padding-bottom:0px;font: 11px arial;border:0;',
                        width: '100%',
                        autoHeight: true,
                        layout: 'fit',
                        xtype: 'panel',
                        html: '<span class="courseExtendedDetails">' + termsAndCondionsText + '</span>'
}],

                        buttons: [{
                            text: SYS.localeMgr.getString('I_AGREE', NE.consts.TEMPLATEID_COURSE, 'I Agree'),
                            id: 'btnAgree',
                            disabled: true,
                            handler: function() {

                                Ext.getCmp('termsCondionWindow').close();
                                cmp.launchExam();


                            }
                        }, {
                            text: SYS.localeMgr.getString('I_DONT_AGREE', NE.consts.TEMPLATEID_COURSE, 'I Do Not Agree'),
                            disabled: true,
                            id: 'btnDontAgree',
                            handler: function() {
                                Ext.getCmp('termsCondionWindow').close();
                            }
}],
                            listeners: {
                                render: function(p) {
                                    p.body.on('scroll', function() {
                                        var el = Ext.getCmp('termsCondionWindow').body.dom;

                                        var scrollTop = el.scrollTop;
                                        var offsetHeight = p.body.dom.offsetHeight;
                                        var scrollHeight = p.body.dom.scrollHeight;

                                        if ((0.9 * scrollHeight) <= (scrollTop + offsetHeight)) {
                                            Ext.getCmp('btnAgree').enable();
                                            Ext.getCmp('btnDontAgree').enable();

                                        }

                                    }, p);
                                },
                                scope: this
                            }
                        });

                        agreement.show();

                        if (agreement.getLayoutTarget().isScrollable() == false) {
                            Ext.getCmp('btnAgree').enable();
                            Ext.getCmp('btnDontAgree').enable();
                        }
                    } else {
                        this.launchExam();
                    }
                },
    launchFlashCards: function () {
        var vpSize = Ext.getBody().getViewSize();
        var winWidth = Math.round(vpSize.width * 0.9);
        var winHeight = Math.round(vpSize.height * 0.95);

        var flashCards = new NE.FlashCards({
            coursewareId: this.courseId
        });

        this.FlashCardsWindow = new Ext.Window({
            bodyStyle: 'background:#FFF;',
            cls: 'flashCardsWindow',
            items: flashCards,
            title: SYS.localeMgr.getString('FLASH_CARDS', NE.consts.TEMPLATEID_COURSE, 'Flash Cards'),
            height: winHeight,
            width: winWidth,
            layout: 'fit',
            modal: true,
            closable: true,
            resizable: false,
            draggable: false
        });

        this.FlashCardsWindow.show();

    },
                launchExam: function() {

                    this.languageId = this.courseLession.languageId;
                    SYS.localeMgr.cacheTemplate(NE.consts.TEMPLATEID_EXAM, function() {
                        if (SYS.cookieMgr.get('bNewExamWindow') == "true") {
                            var exam = new NE.NewExam({
                                examId: this.courseDetails.examId,
                                style: 'z-index:1;',
                                coursePanel: this,
                                proctorKey: this.courseDetails.proctorKey,
                                languageId: this.languageId,
                                examName: this.courseDetails.ExamName
                            });
                        } else {
                            var exam = new NE.Exam({
                                examId: this.courseDetails.examId,
                                style: 'z-index:1;',
                                coursePanel: this,
                                proctorKey: this.courseDetails.proctorKey,
                                languageId: this.languageId,
                                examName: this.courseDetails.ExamName
                            });
                        }

                        var vpSize = Ext.getBody().getViewSize();
                        var winWidth = Math.round(vpSize.width * 0.9);
                        var winHeight = Math.round(vpSize.height * 0.95);

                        this.examWindow = new Ext.Window({
                            title: SYS.cookieMgr.get('bNewExamWindow') == "true" ? SYS.localeMgr.getString('EXAM', NE.consts.TEMPLATEID_COURSE, 'EXAM') + ': ' + '<span class="exam_name">' + this.courseDetails.ExamName + '</span>' : SYS.localeMgr.getString('EXAM', NE.consts.TEMPLATEID_COURSE, 'Exam'),
                            bodyStyle: 'background:#FFF;',
                            cls: 'examWindow',
                            items: exam,
                            height: winHeight,
                            width: winWidth,
                            id: SYS.cookieMgr.get('bNewExamWindow') == "true" ? 'examWindow' : 'examWindow2',
                            layout: 'fit',
                            modal: false,
                            closable: false,
                            resizable: false,
                            draggable: false
                        });

                        this.examWindow.show();
                        this.examWindow.toFront();


                    }, this);


                },

                launchScheduleProctoredExam: function() {

                    // make call to autoLogin
                    //this.showLoading();
                    Ext.Ajax.request({
                        //url: 'proctoruws/Service.asmx/ProctoruAutoLogin',
                        //method: 'POST',
                        params: {
                            op: 'ProctoruAutoLogin'
                        },
                        callback: function(scope, success, response) {
                            if (success) {
                                var response = Ext.util.JSON.decode(response.responseText).d;
                                var url = Ext.util.JSON.decode(response);
                                window.open(url.data.url);
                            }
                        },
                        scope: this
                    });

                    // get response and open new window
                },
                launchScheduleProctoredExamNew: function() {
                    Ext.Msg.show({
                        title: 'INFORMATION',
                        msg: 'Have you registered with ProctorU?',
                        buttons: {
                            yes: 'YES',
                            no: 'NO'
                        },
                        fn: function(button) {
                            if (button == 'yes') {
                                window.open("https://go.proctoru.com/session/new");
                            }
                            else
                                window.open("https://go.proctoru.com/students/users/new?institution=938");
                        }
                    }, this);

                },

                resetCourseCompletion: function() {
                    this.showLoading();
                    Ext.Ajax.request({
                        params: {
                            op: 'ResetUserCourse',
                            courseId: this.courseId
                        },
                        callback: function(scope, success, response) {
                            if (success) {
                                var response = Ext.util.JSON.decode(response.responseText).d;
                                var code = response.code;
                                if (code == 1) {
                                    this.addToCart();
                                }
                                this.fireEvent('resetCourseCompletion', this, this.courseId);
                            }
                            else {
                                NE.app.reloadWebsiteOnError();
                            }
                        },
                        scope: this
                    });
                },




                loadData: function() {

                    var that = this;
                    setTimeout(function() {
                        that.showLoading();
                    }, 400);
                    Ext.Ajax.request({
                        params: {
                            op: 'GetCourseDetails',
                            courseId: this.courseId
                        },
                        success: function(response, options) {

                            this.courseDetails = Ext.util.JSON.decode(response.responseText).d;

                            if (this.courseDetails) {


                                // there were cases where the window was closed while this was executing and causing missing dom errors
                                if (this.body.dom) {
                                    this.IsEnsembaRecommendation = this.courseDetails.isEnsembaRecommendation
                                    this.EnsembaTopic = this.courseDetails.ensembaTopic
                                    this.proctorKey = this.courseDetails.proctorKey;
                        this.isCourseEnrollmentAvailble = true;
                        if (this.certHasPrice == null) {

                            this.isCourseEnrollmentAvailble = !!this.courseDetails.isCourseEnrollmentAvailble;

                        }

                                    if (this.IsEnsembaRecommendation) {
                                        this.ensambaUserId = this.courseDetails.ensembaUserId;

                                        this.socialRecomendations = new Ext.Panel(
                                {
                                    id: "social-recomanddations",
                                    title: "Social Recommendations",
                                    html: '<div id="social-recomedations-div" style="color:#888;height:500px;"><iframe src="'
                                        + '//app.ensemba.com/netexam.html?user_id='
                                        + this.ensambaUserId + '&topic_id=' + this.EnsembaTopic
                                        + '" width="100%" height="100%" frameBorder="0"></div>',
                                    bodyStyle: 'height:500px;',
                                    bodyCssClass: 'social-recomanddations-body'
                                });
                                        Ext.getCmp("maintabpanel").add(this.socialRecomendations);
                                        Ext.getCmp("maintabpanel").setActiveTab(this.courseLession.id);
                                        Ext.getCmp("social-recomanddations").doLayout();
                                    }

                        if (SYS.cookieMgr.get('companyId') == "11019" || SYS.cookieMgr.get('companyId') == "11121") {

                            if (!this.courseLession.hidden) {
                                this.courseLession.refresh();
                                this.courseLession.doLayout();
                            }
                        }
                        else {
                            this.courseLession.refresh();
                            this.courseLession.doLayout();
                        }

                        //Ext.getCmp("courseLessons").doLayout();

                                    // if there is a main panel (course lesson, cert courses, etc) load it's data too 
                                    if (this.mainPanel.loadData) {
                                        this.mainPanel.loadData();
                                    }

                                    // set available actions
                                    this.updateAvailableActions();


                                    // set courseware title
                                    if (this.courseDetails.isPrerequisiteCompany == 1 && this.courseDetails.prerequisitesComplete === "false")
                                        this.setHeaderTitle(this.courseDetails.name, true, 'cs', '');
                                    else
                                        this.setHeaderTitle(this.courseDetails.name, false, 'cs', '');
                                    // convert date string to actual date and set to new property called dateEnrolled
                                    this.courseDetails.dateEnrolled = this.courseDetails.enrollmentDate;

                                    //set score
                                    this.setScore(this.courseDetails.score, this.courseDetails.lessonScore, this.courseDetails.lessonCount, this.courseDetails.scoreAvailable);

                                    // set date enrolled
                                    this.setDateEnrolled(this.courseDetails.dateEnrolled, this.courseDetails.status, this.courseDetails.dCompleteDate, this.courseDetails.iClassRoom, this.courseDetails.UserRequirementStatus);

                                    // set Course Success
                                    this.setCourseSuccessStatus(this.courseDetails.courseSuccessStatus, this.courseDetails.status);

                                    // set progress
                                    this.setPercentComplete(this.courseDetails.percentComplete, this.courseDetails.status, this.courseDetails.scoreAvailable, this.courseDetails.iClassRoom);

                                    // set description
                                    this.setDescription(this.courseDetails.description);

                                    this.VideoRecordEnable = this.courseDetails.VideoRecordEnable; // Ru1 280616
                                    // show new version available message

                        if ((SYS.cookieMgr.get('filterExamLanguage') == 'true' || SYS.cookieMgr.get('bAllowAccessNewerVersion') == 'true') && loaded == 0) {
                                        this.showVersionInfo(this.courseDetails.newVersionId, this.courseDetails.versionLanguages, this.courseDetails.isEnrolledToNewVersion);
                                    }

                                    if (this.courseDetails.hasPrerequisites) {
                                        this.prerequisitesPanel.show();
                                    } else {
                                        this.prerequisitesPanel.hide();
                                    }


                                    if (SYS.cookieMgr.get('NewCoursePage') == 'true') {
                                        this.setImage(this.courseDetails.displayImage);

                                    }

                                    // done by Gimhan 2013/05/22
                                    if (this.courseDetails.bEnforceExpiration && this.courseDetails.status != 'Completed') {
                                        this.setCourseExpiration(this.courseDetails.dCompleteDate);
                                    }

                                    if (this.courseDetails.bDisableUnenrollment) {
                                        this.unEnrollAction.disable();
                                    }
                                    else {
                                        this.unEnrollAction.enable();
                                    }

                                    if (this.courseDetails.enableRating) {
                                        this.avgRating.show();
                                        this.yourRating.show();

                                        this.avgRating.setRating(this.courseDetails.avgRank);
                                        this.yourRating.setRating(this.courseDetails.userRank);
                                        this.yourRating.setUserComment(this.courseDetails.userComment);
                                    } else {
                                        this.avgRating.hide();
                                        this.yourRating.hide();
                                    }

                        if (this.courseDetails.ContestName) {
                            this.contestDetailPanel.show();
                            this.showContestDetails(this.courseDetails.ContestName, this.courseDetails.ContestTypeName, this.courseDetails.ContestStartDate, this.courseDetails.ContestEndDate);
                        }
                                    var contentLength = this.courseDetails['courseoutline'].length +
                                                this.courseDetails['whatwilllearn'].length +
                                                this.courseDetails['whoshouldattend'].length +
                                                this.courseDetails['totalduration'].length +
                                                this.courseDetails['languageoptions'].length +
                                                this.courseDetails['examdetails'].length +
                                                this.courseDetails['assoccerts'].length;


                                    var additionalDetails = '<table>' +
                                    '<tr><td  font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 10px; font-weight: normal><h5><u>' +
                                    SYS.localeMgr.getString('COURSE_OUTLINE', NE.consts.TEMPLATEID_COURSE, 'Course Outline') +
                                    ' </h5></u><BR>{0}</td></tr>' +
                                    '<tr><td class:"courseExtendedDetails"><h5><u> <BR>' +
                                    SYS.localeMgr.getString('WHAT_WILL_LEARN', NE.consts.TEMPLATEID_COURSE, 'What Will Learn') +
                                    ' </h5></u><BR>{1}</td></tr>' +
                                    '<tr><td><h5><u><BR>' +
                                    SYS.localeMgr.getString('WHO_SHOULD_ATTEND', NE.consts.TEMPLATEID_COURSE, 'Who Should Attend') +
                                    ' </h5></u><BR>{2}</td></tr>' +
                                    '<tr><td><h5><u><BR>' +
                                    SYS.localeMgr.getString('TOTAL_DURATION', NE.consts.TEMPLATEID_COURSE, 'Total Duration') +
                                    ' </h5></u><BR>{3}</td></tr>' +
                                    '<tr><td><h5><u><BR>' +
                                    SYS.localeMgr.getString('LANGUAGE_OPTIONS', NE.consts.TEMPLATEID_COURSE, 'Language Options') +
                                    ' </h5></u><BR>{4}</td></tr>' +
                                    '<tr><td><h5><u><BR>' +
                                    SYS.localeMgr.getString('EXAM_DETAILS', NE.consts.TEMPLATEID_COURSE, 'Exam Details') +
                                    ' </h5></u><BR>{5}</td></tr>' +
                                    '<tr><td><h5><u><BR>' +
                                    SYS.localeMgr.getString('ASSOCCERTS', NE.consts.TEMPLATEID_COURSE, 'Assoccerts') +
                                    ' </h5></u><BR>{6}</td></tr>' +
                                '</table>';


                                    this.setCourseOutline(
                                 String.format(additionalDetails,
                                            this.courseDetails['courseoutline'],
                                            this.courseDetails['whatwilllearn'],
                                            this.courseDetails['whoshouldattend'],
                                            this.courseDetails['totalduration'],
                                            this.courseDetails['languageoptions'],
                                            this.courseDetails['examdetails'],
                                            this.courseDetails['assoccerts']
                                ), contentLength
                            );


                                    //Show extended detail panel 
                                    if (contentLength) {
                                        this.extendedDetailPanel.show();
                                    } else {
                                        this.extendedDetailPanel.hide();
                                    }



                                    this.hasExam = !!this.courseDetails.examId;

                                    if (this.hasExam) {
                                        this.setRequirements(SYS.localeMgr.getString(
                                    'REQUIREMENTS_COURSE_EXAM',
                                    NE.consts.TEMPLATEID_COURSE
                              ), this.courseDetails.iClassRoom);
                                    }

                                    if (this.hasExam && this.courseDetails.isRequireExaminer && this.courseDetails.courseComplete == 0) {
                                        this.setRequirements(SYS.localeMgr.getString(
                                    'REQUIREMENTS_COURSE_REQUIREEXAMINER',
                                    NE.consts.TEMPLATEID_COURSE,
                                    'Examiner approval is needed but has not been given'
                              ), this.courseDetails.iClassRoom);
                                    }

                                    if (!this.hasExam) {
                                        this.setRequirements(SYS.localeMgr.getString(
                                    'REQUIREMENTS_COURSE',
                                    NE.consts.TEMPLATEID_COURSE
                              ), this.courseDetails.iClassRoom);
                                    }

                                    if (this.hasExam && this.courseDetails.examRetakeAttemptsLeft <= 0) {
                                        this.setRequirements(SYS.localeMgr.getString(
                                    'REQUIREMENTS_COURSE_EXAM_MAX_ATTEMPTS',
                                    NE.consts.TEMPLATEID_COURSE,
                                    'There is an exam for this course but you have already reached the maximum number of attempts.'
                              ), this.courseDetails.iClassRoom);
                                    }
                                }
                            }

                        },
                        failure: function(response, option) {
                            NE.app.reloadWebsiteOnError();
                        },
                        scope: this
                    }
        );

                    NE.CourseDetail.superclass.loadData.call(this);
                },


                updateAvailableActions: function() {

                    if (this.courseDetails) {


                        var status = this.courseDetails.status;
                        var hasExam = this.courseDetails.examAvailability;
                        var blnHasUpload = this.courseDetails.fileUpload;
                        var examComplete = (this.courseDetails.examAvailability && this.courseDetails.score);
                        var prerequisitesComplete = this.courseDetails.prerequisitesComplete;
                        var examResultsAvailable = this.courseDetails.examResultsAvailable;
                        var certificateAvailable = this.courseDetails.certificateAvailable

                ? parseInt(this.courseDetails.certificateAvailable)
                : 0;

                        var blSurveyAvailable = this.courseDetails.surveyAvailable;
                        var bSurveyRequired = this.courseDetails.bSurveyRequired; //Chinthana
                        var RequiredSurveyComplete = this.courseDetails.RequiredSurveyComplete //Chinthana



                        var allowCourseRetake = this.courseDetails.allowCourseRetake;

                        var isEcommerce = true;
                        var isPrerequisiteCompany = this.courseDetails.isPrerequisiteCompany;
                        var enableForum = this.courseDetails.EnableForum;
                        var iCheckList = this.courseDetails.iCheckList;
                        var iCheckListFilled = this.courseDetails.iCheckListFilled;
                        var iChecklistLearnerFilled = this.courseDetails.iChecklistLearnerFilled;
                        var bEnableChecklist = SYS.cookieMgr.get('EnableChecklist');
                        var retakeOption = this.courseDetails.retakeOption;
                        var isFailed = this.courseDetails.isFailed;
                        var isCompletedForRetake = this.courseDetails.isCompletedForRetake;

                        var scoreAvailable = this.courseDetails.scoreAvailable;
                        var courseType = this.courseDetails.type; /* External Course Module Enhancement*/
            var publicSharing = this.courseDetails.bPublicSharing;
            var isFlashCardsAvailable = this.courseDetails.isFlashCardsAvailable;


                        if (SYS.cfgMgr.get('ECOMMERCE_ENABLED') == "True") {
                            isEcommerce = this.courseDetails.isEcommerce;
                        } else {
                            isEcommerce = false;
                        }

                        if (isEcommerce && status === 'NotEnrolled') {
                            this.enrollAction.hide();
                            this.addToCartAction.enable();
                            this.addToCartAction.show();
                            this.rePrintReceiptAction.hide();
                            this.pricePanel.show();
                            var priceItems;
                            if (this.courseDetails.priceList.length > 0) {
                                priceItems = this.courseDetails.priceList.toString().split(',');
                            }

                            if (this.courseDetails.priceList.length == 0 && isEcommerce) {
                                this.pricePanel.body.update('Not available');
                            } else {
                                var i;
                                var priceText = "";
                                for (i = 0; i < priceItems.length; i++) {
                                    var priceItem = priceItems[i];
                                    if (priceItem.length > 0) {
                                        var array = priceItem.split('|');
                                        if (array[2] != undefined) {
                                            var trainingCreditText = array[2].toString();
                                            priceText = "Training Credits:" + trainingCreditText + "<br/><br/>";
                                        }
                                        priceText = priceText + '[' + array[0].toString() + '] ' + SYS.currencyFormatter(array[1], array[0]) + "<br/>";
                                    }
                                }
                                this.pricePanel.body.update(priceText);
                            }
                        }

                        // hide all actions
                        this.enrollAction.hide();
                        this.unEnrollAction.hide();
                        this.takeExamAction.hide();
                        this.scheduleProctoredExamAction.hide();
                        this.examResultsAction.hide();
                        this.viewCertificateAction.hide();
                        this.addToLinkedInAction.hide();
                        this.userFileUpload.hide();
                        this.addToCartAction.hide();
                        this.takeSurveyAction.hide();
                        this.preReqMsg.hide();
                        this.retakeCourse.hide();
                        this.viewCheckList.hide();
                        this.helpLink.hide();
                        this.approvalDenies.hide();
                        this.pbar.hide();
                        this.progressPanel.hide();
                        this.rePrintReceiptAction.hide();
            this.publicSharingAction.hide();
this.shareBadgeAction.hide();
            this.takeFlashCardsAction.hide();

                        this.unEnrollAction.enable(); //Sarith 15-02-2013
                        this.enrollAction.enable(); //Sarith 15-02-2013
                        // decide which action buttons to display and display them

                        //                        if (scoreAvailable) {
                        //                            if (SYS.cookieMgr.get('NewCoursePage') == 'true') {
                        //                                this.progressPanel.show();
                        //                            } else {
                        //                                this.pbar.show();
                        //                            }
                        //                        }

                        if (status === 'Enrolled' && prerequisitesComplete === 'true') {
                            this.unEnrollAction.show();
                        }

                        if (status === 'NeedApproval') {
                            this.enrollAction.show();
                            this.enrollAction.disable();

                        }
                        if (status === 'DeniedApproval') {
                            this.enrollAction.hide();
                            this.approvalDenies.show();
                        }
                        if (status === 'DisableIndividualCourseEnrollment') {
                            this.enrollAction.show();
                            this.enrollAction.disable();

                        }
                        if (status === 'NotEnrolled' && prerequisitesComplete === 'true') {
                //Mcafee
                if (NE.user.companyId == 10829 || NE.user.companyId == 10983 || NE.user.companyId == 11001 || NE.user.companyId == 11099 || NE.user.companyId == 10573) {
                    // If certification has a price and Display Courses Individually is not selected, then do not show the Add to Cart/Enroll button on the courses within the certification.
                    if ((this.certStatus == 'NotEnrolled' && this.certHasPrice && !this.displayCoursesIndividually) || !this.isCourseEnrollmentAvailble) {
                        this.enrollAction.hide();
                    }
                    else {
                            this.enrollAction.show();
                    }
                }
                else {
                    this.enrollAction.show();
                }
                        }

                        if (status === 'NotEnrolled' && prerequisitesComplete === 'false') {
                            if (isPrerequisiteCompany != 1)
                                this.preReqMsg.show();
                        }

                        if (this.courseDetails.isReprintReceipt) {
                            this.rePrintReceiptAction.show();
                        }


                        if (prerequisitesComplete === 'false') {
                            if (isPrerequisiteCompany != 1)
                                this.preReqMsg.show();
                        }

            // if enrolled and an exam is available show exam button

            if (SYS.cookieMgr.get('companyId') == "11019" || SYS.cookieMgr.get('companyId') == "11121") {

                if (status === 'Enrolled' && this.courseDetails.examAvailability) {
                    if (this.courseDetails.bShowNewExamUI) {


                        this.mainCoursePanel.hide();
                        if (this.mainCoursePanel.hidden) {
                            this.newExamUI.show();
                        }

                    }
                    else {
                        this.takeExamAction.show();
                    }
                }
                else {
                    if (this.mainCoursePanel.hidden) {
                        this.mainCoursePanel.show();
                    }
                    this.newExamUI.hide();

                }
               if (this.courseDetails.isLiveProctoring) {
                    this.scheduleProctoredExamAction.show();
                    //this.takeExamAction.hide();
                }
            }

            else {
                //if (status === 'Enrolled' && this.courseDetails.examAvailability) {
		if (this.courseDetails.examAvailability) {
                    this.takeExamAction.show();
                }


                //if (NE.user.companyId == 10705 || NE.user.companyId == 10949) {
                //this.scheduleProctoredExamAction.show();
                //this.takeExamAction.hide();
                //}
                if (this.courseDetails.isLiveProctoring) {
                    this.scheduleProctoredExamAction.show();
                    //this.takeExamAction.hide();
                }
                //  this.takeExamAction.show();
                this.takeExamActionBottom.enable();
            }

                        // #1369
                        if (blnHasUpload) {
                            this.userFileUpload.show();
                        }

                        // if exam has been completed then show exam results button
                        if ((status === 'Enrolled' || status === 'Completed') && examResultsAvailable === 'true') {
                            this.examResultsAction.show();
                        }

                        // if certificate available and exam completed then show view cert button
                        if (certificateAvailable && (status === 'Completed')) {
                            this.viewCertificateAction.show();

                if (publicSharing) {
                    this.publicSharingAction.show();
this.shareBadgeAction.show();
                }
                            if (this.courseDetails.certFile != '') {
                                this.addToLinkedInAction.show();
                            }
                        }


                        if (isEcommerce && status === 'NotEnrolled' && prerequisitesComplete === 'true') {
                            this.enrollAction.hide();
                this.rePrintReceiptAction.hide();


                //Mcafee
                if (NE.user.companyId == 10229 || NE.user.companyId == 10829 || NE.user.companyId == 10983 || NE.user.companyId == 11001 || NE.user.companyId == 11099 || NE.user.companyId == 10573) {
                    // If certification has a price and Display Courses Individually is not selected, then do not show the Add to Cart/Enroll button on the courses within the certification.
                    if ((this.certStatus == 'NotEnrolled' && this.certHasPrice && !this.displayCoursesIndividually) || !this.isCourseEnrollmentAvailble) {
                       this.addToCartAction.hide();
                    }
                    else {
                        this.addToCartAction.show();
                    }
                }
                else {
                    this.addToCartAction.show();
                }
                            //if (this.courseDetails.price>0) {
                            //this.setPrice(this.courseDetails.price);
                            //}
                        }

                        if ((blSurveyAvailable == 1 && status != 'NotEnrolled') ) {
                            this.takeSurveyAction.show();
                            this.takeSurveyActionBottom.enable();
                        }


                        //Ecommerce courses shold not be allowed to do any action after purchase.
                        if (isEcommerce && (status != 'NotEnrolled')) {
                            this.enrollAction.hide();
                            if(status === 'DisableCart')
                            {
                                this.addToCartAction.disable();
                                this.addToCartAction.show();
                            }
                            else
                            {
                            //this.unEnrollAction.hide();
                                this.addToCartAction.hide();
                            }
                            // this.setPrice( this.courseDetails.price );
                        }


                        if (retakeOption == 1 && isCompletedForRetake == true) {
                            this.retakeCourse.show();
                        } else if (retakeOption == 2 && isFailed == true) {
                            this.retakeCourse.show();
                        } else if (retakeOption == 3 && this.isCourseExpired(this.courseDetails.dCompleteDate)) {
                            this.retakeCourse.show();
                        }
                        //Added by Chinthana 16/02/2016
                        if (RequiredSurveyComplete || ((NE.user.companyId == 10960 || NE.user.companyId == 11017) && status === 'Completed' && blSurveyAvailable)) {
                            this.takeSurvey(RequiredSurveyComplete);
                        }


                        if (bEnableChecklist && (status === 'Enrolled' || (status === 'Completed' && (NE.user.companyId == 11165 || NE.user.companyId == 11189)))) {
                            if (iCheckList > 0) {
                                if (iCheckListFilled > 0) {
                                    this.viewCheckList.setIconClass("icon-course-checklistFilled");
                                }

                                else {
                                    if (iChecklistLearnerFilled > 0) {
                                        this.viewCheckList.enable();
                                    }
                                    else {
                                        this.viewCheckList.disable();
                                    }

                                }
                                this.viewCheckList.show();
                            }
                        }




                        if (enableForum) {
                            this.discussionPanel.show()
                        }

                        if (this.courseDetails.isExternalRegistrationLink) {
                            this.enrollAction.hide();
                            this.unEnrollAction.hide();
                        }
                        //if (SYS.cookieMgr.get('bNewDescriptionPanel') == 'true') {
                        if (SYS.cookieMgr.get('SupportEmail') != undefined) {
                            if (SYS.cookieMgr.get('SupportEmail').length > 0) {
                                this.helpLink.show();
                                // Ext.get('helpLink').setStyle('display', 'block');
                            }
                        }

                        /* External Course Module Enhancement*/
                        if (courseType == "external") {
                            this.enrollAction.hide();
                            this.addToCartAction.hide();
                            this.takeExamAction.hide();

                        }
                        /* End External Course Module Enhancement*/
            if (this.courseDetails.isFlashCardsAvailable && status === 'Enrolled') {

                this.takeFlashCardsAction.show();
            }
                        var that = this;
                        setTimeout(function() {
                            that.hideLoading();
                        }, 500);

                    }

                    // call parent setAvailableActions
                    NE.CourseDetail.superclass.updateAvailableActions.call(this);

                },

                setRequirements: function(requirementsText, iClassroom) {
                    // display information to user related to competion of courseware item
                    if (iClassroom != 3) {//hide this for resource courses
                        this.requirementsPanel.show();
                        this.requirementsPanel.body.update(requirementsText);
                    }
                },

                setDescription: function(description) {
                    if (description.length) {
                        //XNG-775-54259 by Shrideshi
                        if (SYS.cookieMgr.get('NewCoursePage') == 'true' && SYS.cookieMgr.get('bNewDescriptionPanel') == 'true') {
                            this.newDescriptionPanel.show();
                            this.newDescriptionPanel.body.update('<b>' + SYS.localeMgr.getString('COURSE_DESCRIPTION', NE.consts.TEMPLATEID_COURSE, 'Course Description')
                + '</b><br><br>' + description);
                        } else {
                            this.descriptionPanel.show();
                            this.descriptionPanel.body.update(description);
                        }
                    }
                },

                showVersionInfo: function(courseId, lang, isEnrolledToNewVersion) {
                    if (courseId != 0) {
                        //if (SYS.cookieMgr.get('NewCoursePage') == 'true' && SYS.cookieMgr.get('bNewDescriptionPanel') == 'true') {
                        //            this.MsgNewVersion.show();
                        //            this.MsgNewVersion.body.update('<b>' + SYS.localeMgr.getString('VERSION_DESCRIPTION', NE.consts.TEMPLATEID_COURSE, 'Newer version of this course is available')
                        //                            + '</b><br>' + SYS.localeMgr.getString('VERSION_DESCRIPTION', NE.consts.TEMPLATEID_COURSE, ' Supported Languages of the Course : ') + lang + '</br> <span href="#"  id="' + courseId
                        //                            + '" class="enroll-btn link">[ ' + SYS.localeMgr.getString('ENROLL_NEW_VERSION', NE.consts.TEMPLATEID_GROUP_TRANSCRIPT, 'Enroll to New Version') + ' ]</span>');
                        //}

                        loaded = 1;
                        var cmp = this;
            if (SYS.cookieMgr.get('filterExamLanguage') == 'true') {
                        if (isEnrolledToNewVersion == false) {
                            Ext.MessageBox.buttonText.yes = SYS.localeMgr.getString('YES', NE.consts.TEMPLATEID_MAIN_UI, 'yes');
                            Ext.MessageBox.buttonText.no = SYS.localeMgr.getString('NO', NE.consts.TEMPLATEID_MAIN_UI, 'no');
                            Ext.MessageBox.confirm(SYS.localeMgr.getString('INFO', NE.consts.TEMPLATEID_MAIN_UI, 'Info'), SYS.localeMgr.getString('VERSION_DESCRIPTION', NE.consts.TEMPLATEID_MAIN_UI, 'A newer version of this course is available, in the following languages:') + '</br>' + lang + '</br>Would you like to enroll onto the newer version?', function(btn) {
                                if (btn == 'yes') {
                                    NE.app.launchDirectLink('#:cs' + courseId + ":autoenroll=1");
                                    cmp.ownerCt.destroy();
                                }
                            });
                        } else if (isEnrolledToNewVersion == true) {
                            Ext.MessageBox.buttonText.yes = SYS.localeMgr.getString('YES', NE.consts.TEMPLATEID_MAIN_UI, 'yes');
                            Ext.MessageBox.buttonText.no = SYS.localeMgr.getString('NO', NE.consts.TEMPLATEID_MAIN_UI, 'no');
                            Ext.MessageBox.confirm(SYS.localeMgr.getString('INFO', NE.consts.TEMPLATEID_MAIN_UI, 'Info'), SYS.localeMgr.getString('VERSION_DESCRIPTION_NOT_ENROLLED', NE.consts.TEMPLATEID_MAIN_UI, 'A newer version of this course is available, in the following languages:') + '</br>' + lang + '</br>Would you like to view the newer version?', function(btn) {
                                if (btn == 'yes') {
                                    NE.app.launchDirectLink('#:cs' + courseId);
                                    cmp.ownerCt.destroy();
                                }
                            });
                        }
            } else {
                if (isEnrolledToNewVersion == false) {
                    Ext.MessageBox.buttonText.yes = SYS.localeMgr.getString('YES', NE.consts.TEMPLATEID_MAIN_UI, 'yes');
                    Ext.MessageBox.buttonText.no = SYS.localeMgr.getString('NO', NE.consts.TEMPLATEID_MAIN_UI, 'no');
                    Ext.MessageBox.confirm(SYS.localeMgr.getString('INFO', NE.consts.TEMPLATEID_MAIN_UI, 'Info'), SYS.localeMgr.getString('VERSION_DESCRIPTION', NE.consts.TEMPLATEID_MAIN_UI, 'A newer version of this course is available. Would you like to enroll onto the newer version?') , function (btn) {
                        if (btn == 'yes') {
                            NE.app.launchDirectLink('#:cs' + courseId + ":autoenroll=2");
                            cmp.ownerCt.destroy();
                        }
                    });
                    
                } else if (isEnrolledToNewVersion == true) {
                    Ext.MessageBox.buttonText.yes = SYS.localeMgr.getString('YES', NE.consts.TEMPLATEID_MAIN_UI, 'yes');
                    Ext.MessageBox.buttonText.no = SYS.localeMgr.getString('NO', NE.consts.TEMPLATEID_MAIN_UI, 'no');
                    Ext.MessageBox.confirm(SYS.localeMgr.getString('INFO', NE.consts.TEMPLATEID_MAIN_UI, 'Info'), SYS.localeMgr.getString('VERSION_DESCRIPTION_NOT_ENROLLED', NE.consts.TEMPLATEID_MAIN_UI, 'A newer version of this course is available.Would you like to view the newer version?') , function (btn) {
                        if (btn == 'yes') {
                            NE.app.launchDirectLink('#:cs' + courseId);
                            cmp.ownerCt.destroy();
                        }
                    });
                }
                
            }

                    }
                },

                setImage: function(imageUrl) {
                    if (imageUrl.length) {
                        this.imagePanel.show();
                        var imageUrl = NE.cfg.baseUrl + imageUrl;
                        this.imagePanel.update("<img style='width: 100%'; src='" + imageUrl + " '/>");
                    }
                },

                setCourseExpiration: function(completedate) {
                    if (completedate !== '') {
                        var ccompleteDate = new Date(completedate);
                        currentdate = new Date();

                        // The number of milliseconds in one day
                        var ONE_DAY = 1000 * 60 * 60 * 24;

                        // Convert both dates to milliseconds
                        var date1_ms = ccompleteDate.getTime();
                        var date2_ms = currentdate.getTime();
                        // Calculate the difference in milliseconds
                        var difference_ms = (date1_ms - date2_ms);
                        var datediff = Math.round(difference_ms / ONE_DAY);
                        // Convert back to days and return
                        if (datediff < 0) {
                            this.courseExpirationPanel.show();
                            this.courseExpirationPanel.body.update(SYS.localeMgr.getString('COURSE_EXPIRATION_MSG', NE.consts.TEMPLATEID_COURSE, 'Expired'));
                        }
                        else {
                            this.courseExpirationPanel.show();
                            this.courseExpirationPanel.body.update(datediff + ' ' + SYS.localeMgr.getString('COURSE_EXPIRATION_DAYSLEFT', NE.consts.TEMPLATEID_COURSE, 'Day(s) left'));
                        }
                    }
                },
                //    IsCourseExpiration: function(completedate) {
                //        if (completedate !== '') {
                //            var ccompleteDate = new Date(completedate);
                //            currentdate = new Date();

                //            // The number of milliseconds in one day
                //            var ONE_DAY = 1000 * 60 * 60 * 24;

                //            // Convert both dates to milliseconds
                //            var date1_ms = ccompleteDate.getTime();
                //            var date2_ms = currentdate.getTime();
                //            // Calculate the difference in milliseconds
                //            var difference_ms = (date1_ms - date2_ms);
                //            var datediff = Math.round(difference_ms / ONE_DAY);
                //            // Convert back to days and return
                //            if (datediff < 0) {
                //                return 'true';
                //            }
                //            else {
                //                return 'false';
                //            }
                //        }
                //        else {
                //            return 'false';
                //        }
                //    }
                //    ,
                setCourseOutline: function(courseOutlineContent, contentLength) {
                    if (contentLength) {
                        //this.courseOutline.show();
                        //this.courseOutline.body.update(courseOutlineContent);
                    }
                },

                setScore: function(score, lessonScore, lessonCount, scoreAvailable) {
                    if (scoreAvailable) {
                        if (score > 0 || lessonScore > 0) {
                            if (lessonCount == 1) {
                                this.scorePanel.show();
                                if (score) {
                                    this.scorePanel.body.update(SYS.localeMgr.getString('SCORE', NE.consts.TEMPLATEID_COURSE, 'Score') + ': ' + score / 100 + '%');
                                }
                                if (lessonScore) {
                                    this.scorePanel.body.update(SYS.localeMgr.getString('SCORE', NE.consts.TEMPLATEID_COURSE, 'Score') + ': ' + lessonScore / 100 + '%');
                                }
                            }
                        }
                        else {
                            this.scorePanel.hide();
                        }
                    } else {
                        this.scorePanel.hide();
                    }
                },

                setDateEnrolled: function(dateEnrolled, status, dCompleteDate, iClassroom, requirementStatus) {
                    // only show date complete on enrolled courses
                    if (SYS.cookieMgr.get('bNewDescriptionPanel') == 'true') {
                        if (status !== 'NotEnrolled') {
                            if (iClassroom != 3) {//hide this for resource courses
                                this.dateEnrolledDuedatePanel.show();

                            }
                            if (dCompleteDate) {
                                if (requirementStatus !== '') {
                                    this.dateEnrolledDuedatePanel.items.items[0].update(SYS.localeMgr.getString('REQUIRMENT_STATUS', NE.consts.TEMPLATEID_COURSE, 'Req. Status') + ':<br>' 
                                        + SYS.localeMgr.getString('ENROLLMENT_DATE', NE.consts.TEMPLATEID_COURSE, 'Enrollment Date') + ':<br>'
                                        + SYS.localeMgr.getString('DUE_DATE', NE.consts.TEMPLATEID_COURSE, 'Due Date') + ':');

                                    this.dateEnrolledDuedatePanel.items.items[1].update(requirementStatus + '<br>' + dateEnrolled + '<br>' + dCompleteDate);
                                }
                                else {
                                    this.dateEnrolledDuedatePanel.items.items[0].update(SYS.localeMgr.getString('ENROLLMENT_DATE', NE.consts.TEMPLATEID_COURSE, 'Enrollment Date') + ':<br>'
                                        + SYS.localeMgr.getString('DUE_DATE', NE.consts.TEMPLATEID_COURSE, 'Due Date') + ':');

                                    this.dateEnrolledDuedatePanel.items.items[1].update(dateEnrolled + '<br>' + dCompleteDate);
                                }
                            } else {
                                this.dateEnrolledDuedatePanel.items.items[0].update(SYS.localeMgr.getString('ENROLLMENT_DATE', NE.consts.TEMPLATEID_COURSE, 'Enrollment Date'));
                                this.dateEnrolledDuedatePanel.items.items[1].update(dateEnrolled);
                            }
                        } else {
                            this.dateEnrolledPanel.hide();
                            this.dateEnrolledDuedatePanel.hide();
                        }
                    } else {
                        if (status !== 'NotEnrolled') {
                            if (iClassroom != 3) { //hide this for resource courses
                                this.dateEnrolledPanel.show();
                            }
                            this.dateEnrolledPanel.body.update(dateEnrolled);
                        } else {
                            this.dateEnrolledPanel.hide();
                        }
                    }
                },

                setCourseSuccessStatus: function(courseSuccessStatus, status) {

                    if (status !== 'NotEnrolled' && courseSuccessStatus !== "") {
                        this.courseSuccessStatusPanel.show();
                        this.courseSuccessStatusPanel.body.update(courseSuccessStatus);
                    } else {
                        this.courseSuccessStatusPanel.hide();
                    }

                },

                setPrice: function(price) {
                    this.pricePanel.show();
                    this.pricePanel.body.update(SYS.currencyFormatter(price, this.classRecord.get('SelectedCurrency')));
                },

                // set progress bar value
                setPercentComplete: function(percentComplete, status, scoreAvailable, iClassroom) {


                    var statusClass = '';
                    var decComplete;

                    if (status === 'NotEnrolled' || percentComplete == 0) {
                        decComplete = 0;
                        statusClass = 'not-started';
                    } else {
                        decComplete = (percentComplete / 100);
                    }


                    if (SYS.cookieMgr.get('NewCoursePage') == 'true') {
                        this.pbar.hide();

                        if (status !== 'NotEnrolled') {

                            if (SYS.cookieMgr.get('bHideProgressForZero') == 'true' && percentComplete == 0) {
                                this.progressPanel.hide();
                            } else {

                                if (iClassroom != 3) {

                                    this.progressPanel.show();
                                }

                                if (scoreAvailable) {

                                    this.progressPanel.body.update('<p align="center"><font size="6" color="gray" weight="bold">' + percentComplete +
                                        '%</font> <br><font size="4" color="gray" >'
                                        + SYS.localeMgr.getString('COMPLETE', NE.consts.TEMPLATEID_COURSE) + '</font></p>');
                                }
                            }
                        } else {
                            this.progressPanel.hide();
                        }
                    } else {

                        if (iClassroom != 3) {
                            this.pbar.show();
                        }
                        var progressMsg = percentComplete + '% ' + SYS.localeMgr.getString('COMPLETE', NE.consts.TEMPLATEID_COURSE);
                        if (status === 'NotEnrolled') {
                            progressMsg = SYS.localeMgr.getString('NOT_ENROLLED', NE.consts.TEMPLATEID_COURSE, 'Not enrolled');
                        }

                        if (status !== 'NotEnrolled' && decComplete === 0) {
                            progressMsg = SYS.localeMgr.getString('NOT_STARTED', NE.consts.TEMPLATEID_COURSE, 'Not Started');
                        }
                        if (scoreAvailable) {
                            var progressText = String.format('<div class="detail-progress-text {1}">{0}</div>', progressMsg, statusClass);
                            this.pbar.updateProgress(decComplete, progressText, true);
                        }
                    }



                },

                addCourseEnrollment: function() {
                    // make ajax call to AddCourseEnrollment

                    this.showLoading(); //Sarith 17-01-2013
                    this.enrollAction.disable(); //Sarith 28-01-2013

                    Ext.Ajax.request({
                        params: {
                            op: 'AddCourseEnrollment',
                            courseId: this.courseId
                        },
                        callback: function(scope, success, response) {
                            if (success) {
                                //this.refresh();
                                this.fireEvent('addCourseEnrollment', this, this.courseId);
                            }
                            else {
                                NE.app.reloadWebsiteOnError();
                                this.hideLoading();  //Sarith 17-01-2013
                                this.refresh(); //Sarith 12-02-2013
                            }
                        },
                        scope: this
                    });
                },




                viewCheckListAction: function() {

                    var iCourseId = this.courseId;
                    var iCheckListId = this.courseDetails.iCheckList;
                    var iChecklistLearnerFilled = this.courseDetails.iChecklistLearnerFilled;
                    var iEdit = 0;
                    if (iChecklistLearnerFilled == 1) {
                         if(NE.user.companyId == 11165 || NE.user.companyId == 11189)
                        {
                            iEdit = 0;
                        }
                        else
                        {
                            iEdit = 2;
                        }
                    }

                    Ext.Ajax.request({
                        params: {
                            op: 'GetExaminerCheckListDetails'
                        },
                        callback: function(scope, success, response) {
                            if (success) {

                                var responseObject = Ext.util.JSON.decode(response.responseText).d;

                                var iCompany = responseObject.company;
                                var userId = responseObject.userId;

                                var vpSize = Ext.getBody().getViewSize();
                                var winWidth = Math.round(vpSize.width * 0.95);
                                var winHeight = Math.round(vpSize.height * 0.95);

                                var urlCheckList = window.location.protocol + "//" + window.location.host + "/checklist/" + "ExaminerCheckList.aspx?companyId=" + iCompany + "&checkListId=" + iCheckListId + "&studentId=" + userId + "&examiner=" + iEdit + "&ex=&sid=" + iCourseId + "&stsession=" + SYS.cookieMgr.get('sessionId');

                                var browser = window.navigator.userAgent;
                                var isFireFox = browser.indexOf("Firefox");

                                var thatCmp = this;

                                if (isFireFox > 0) {
                                    var checkListWin = new Ext.Window({
                                        title: SYS.localeMgr.getString('EXAMINER_CHECKLIST', NE.consts.TEMPLATEID_TRANSCRIPT, 'Examiner CheckList'),
                                        id: 'course-examiner-checklist',
                                        width: parseInt(SYS.cookieMgr.get('responsive')) && NE.cfg.isMobileDevice ? '95vw' : winWidth,
                                        height: parseInt(SYS.cookieMgr.get('responsive')) && NE.cfg.isMobileDevice ? '95vh' : winHeight,
                                        bodyStyle: 'background:#FFF;',
                                        autoScroll: true,
                                        closable: true,
                                        draggable: false,
                                        maximizable: true,
                                        items: [{
                                            xtype: "panel",
                                            id: 'checklist',
                                            //setAutoScroll: true,
                                            autoEl: {
                                                src: urlCheckList,
                                                tag: "IFrame",
                                                height: '99%',
                                                width: '100%',
                                                border: '0',
                                                frameborder: '0',
                                                scrolling: 'true'
                                            }

}],
                                            listeners: {
                                                close: function() {
                                                    thatCmp.refresh();
                                                    this.fireEvent('submitStudentChecklist', this);

                                                }
                                            }
                                        });

                                        checkListWin.show();

                                    }
                                    else {

                                        var checkListWin = new Ext.Window({
                                            id: 'course-examiner-checklist',
                                            layout: 'fit',
                                            //width: '90%',
                                            width: winWidth,
                                            //autoScroll: true,
                                            closable: true,
                                            draggable: false,
                                            maximizable: true,
                                            height: winHeight,
                                            items: [{
                                                autoHeight: true,
                                                width: '100%',
                                                height: winHeight,
                                                xtype: 'panel',
                                                html: '<iframe src=' + urlCheckList + ' width="100%" height=' + winHeight + ' frameborder="0"></iframe>'

}],
                                                listeners: {
                                                    close: function() {
                                                        thatCmp.refresh();
                                                        this.fireEvent('submitStudentChecklist', this);


                                                    }
                                                }
                                            });

                                            checkListWin.show();

                                        }

                                    }
                                    else {
                                        NE.app.reloadWebsiteOnError();
                                    }
                                },
                                scope: this
                            });
                        },


                        removeCourseEnrollment: function() {

                            Ext.Msg.show({
                                title: '',
                                width: NE.cfg.isMobilePhone && parseInt(SYS.cookieMgr.get('responsive')) ? NE.cfg.currentViewWidth - NE.cfg.currentViewWidth / 10 : 'auto',
                                msg: (this.courseDetails.price > 0) ? SYS.localeMgr.getString('UNENROLPAIDPROMT_COURSE', NE.consts.TEMPLATEID_COURSE, 'This is paid course. Are you sure you want to un-enroll from the Paid course ?') : SYS.localeMgr.getString('UNENROLPROMT', NE.consts.TEMPLATEID_COURSE, 'Are you sure you want to un-enroll from the course ?'),
                                buttons: {
                                    yes: SYS.localeMgr.getString('UNENROLOK', NE.consts.TEMPLATEID_COURSE, 'OK'),
                                    no: SYS.localeMgr.getString('UNENROLCANCEL', NE.consts.TEMPLATEID_COURSE, 'Cancel')
                                },
                                fn: function(button) {
                                    if (button == 'yes') {

                                        this.showLoading(); //Sarith 28-01-2013
                                        this.unEnrollAction.disable(); //Sarith 28-01-2013

                                        // make ajax call to AddCourseEnrollment
                                        Ext.Ajax.request({
                                            params: {
                                                op: 'RemoveCourseEnrollment',
                                                courseId: this.courseId
                                            },
                                            callback: function(scope, success, response) {
                                                if (success) {
                                                    //this.refresh();
                                                    this.fireEvent('removeCourseEnrollment', this, this.courseId);
                                                }
                                                else {
                                                    NE.app.reloadWebsiteOnError();
                                                    this.hideLoading();  //Sarith 18-01-2013
                                                    this.refresh(); //Sarith 12-02-2013
                                                }
                                            },
                                            scope: this
                                        });
                                    }
                                },
                                scope: this,
                                icon: Ext.MessageBox.QUESTION
                            });


                        },
                        isCourseExpired: function(completedate) {
                            if (completedate !== '') {
                                var ccompleteDate = new Date(completedate);
                                currentdate = new Date();

                                // The number of milliseconds in one day
                                var ONE_DAY = 1000 * 60 * 60 * 24;

                                // Convert both dates to milliseconds
                                var date1_ms = ccompleteDate.getTime();
                                var date2_ms = currentdate.getTime();
                                // Calculate the difference in milliseconds
                                var difference_ms = (date1_ms - date2_ms);
                                var datediff = Math.round(difference_ms / ONE_DAY);
                                // Convert back to days and return

                                if (datediff < 0) {
                                    return true;
                                }
                                else {
                                    return false
                                }
                            }
                        },


                        //Add mask for enroll - Sarith 16-01-2013
    showContestDetails: function (contestName, contestTypeName, startDate, endDate) {

        var htmlContest = '<div class = "dv-contestname">' + contestName + '</div>' +
        '<div class="dv-contestTypeName">' +
            '<span class ="ctname">' + SYS.localeMgr.getString('CONTEST_TYPE', NE.consts.TEMPLATEID_COURSE, 'Type') + ': </span>' +
            '<span class ="conTpname">' + contestTypeName + '</span>' +
        '</div>' +
        '<div class="dv-dtstart">' + SYS.localeMgr.getString('DATE_RANGE', NE.consts.TEMPLATEID_COURSE, 'Date range') + ': </div>' +
        '<div class="dv-dtrange">' + startDate + ' - ' + endDate + '</div>' +
        '<div class="dv-winners">' + SYS.localeMgr.getString('WINNERS', NE.consts.TEMPLATEID_COURSE, 'Winners') + '</div>';
        this.contestDetailPanel.body.update(htmlContest);
    },

                        showLoading: function() {
                            this.loadMask = this.loadMask || new Ext.LoadMask(this.body, {
                                msg: SYS.localeMgr.getString('UPDATING', NE.consts.TEMPLATEID_COURSE, 'Updating') + '...',
                                scope: this
                            });
                            this.loadMask.show();
                        },

                        hideLoading: function() {
                            if (this.loadMask) {
                                this.loadMask.hide();
                            }
                        },

                        onClose: function() {
                            alert(555);
                        },


                        ////Add mask for enroll - Sarith 16-01-2013


                        afterRender: function(ct, position) {
                            this.loadData();

                            NE.CourseDetail.superclass.afterRender.call(this, ct, position);

                            // set location token for history (wait till after everything is finished because of IE performance quirks)
                            setTimeout("Ext.History.add(':cs' + " + this.courseId + ")", 1000);
                        }

                    }
);
Ext.reg('course', NE.CourseDetail);
