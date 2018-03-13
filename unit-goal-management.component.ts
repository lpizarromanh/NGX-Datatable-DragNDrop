import { Component, OnInit, Input, ViewContainerRef, OnChanges } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NetworkService } from '../app.network.service';
import { AuthService } from '../app.authenticate.service';
import { CacheService, CacheStorageAbstract, CacheLocalStorage } from 'ng2-cache/ng2-cache';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DragulaExtendedDirective } from './../dragula-extended.directive';
import { DragulaModule, DragulaService } from 'ng2-dragula';

@Component({
  selector: 'unit-goal-management',
  templateUrl: './unit-goal-management.component.html',
  providers: [NetworkService, AuthService, CacheService, {provide: CacheStorageAbstract, useClass: CacheLocalStorage}]
})
export class UnitGoalManagementComponent {

  public visible = false;
  private visibleAnimate = false;

  public editorOptions: Object;

  public buttonsShow: boolean = true;
  public warningCounter: number = 1;

  public rowsLookingBackReady: boolean;
  public rowsRealTimeReady: boolean;
  public rowsLookingAheadReady: boolean;

  public rowsLookingBack: any;
  public columnsLookingBack: any;
  public rowsRealTime: any;
  public columnsRealTime: any;
  public rowsLookingAhead: any;
  public columnsLookingAhead: any;
  public authorTemp: string;
  public dataBack = [];
  public dataReal = [];
  public dataForward = [];

  public options = {
    position: ["top", "right"],
    timeOut: 10000,
    lastOnBottom: true
  }

  goalViewPoints:any[]= [
    {id: "1", name: "Looking Back"},
    {id: "2", name: "Real Time"},
    {id: "3", name: "Looking Ahead"}
  ];

  public goalViewPointsValue: string;

  public goalTitle: string;
  public uniGoal1: boolean;
  public uniGoal2: boolean;
  public uniGoal3: boolean;
  public uniGoal4: boolean;
  public uniGoal5: boolean;
  public goalStatement: string;
  public goalAlign: string;
  public goalActionPlan: string;
  public notes: string;

  public goalTitleUpdate: string;
  public uniGoal1Update: boolean;
  public uniGoal2Update: boolean;
  public uniGoal3Update: boolean;
  public uniGoal4Update: boolean;
  public uniGoal5Update: boolean;
  public goalStatementUpdate: string;
  public goalAlignUpdate: string;
  public goalActionPlanUpdate: string;
  public notesUpdate: string;
  public updateViewpointOption: string;
  public goalViewPointsValueUpdate: string;
  public currentGoalID: string;

  public role: string;

  constructor(private http: Http, private authService: AuthService, private networkService: NetworkService,
    private _cacheService: CacheService, public toastr: ToastsManager, vcr: ViewContainerRef) {

      this.toastr.setRootViewContainerRef(vcr);

      this.editorOptions = {
        key: 'Tb1wC2ssm==',
        placeholderText: 'Type Here',
        toolbarButtons: ['undo', 'redo' , '|', , 'fullscreen'],
        height: 300,
        tabSpaces: 4,
        enter: 'ENTER_P',
        quickInsertTags: ['']
      }

    }

  ngOnInit(): void {

    this.role = this._cacheService.get('sysrole');

    this.columnsLookingBack = [
      { prop: 'id', name:'#'},
      { prop: 'goal', name: 'Goal Title'},
      { prop: 'status', name: 'Status'},
      { prop: 'date', name: 'Last Updated'},
      { prop: 'author', name: 'Author'}
    ];

    this.networkService.post({functionNum: 0, authorid: "",bpyear: this._cacheService.get('bpyear'),
    ouabbrev: this._cacheService.get('collegeabbrev'), section: "Unit Goals Management"}).then(_ => {;

      if (this.networkService.returnData.status == "Dean Approved" ||
      this.networkService.returnData.status == "Pending Dean Approval"){

        this.buttonsShow = false;

      }

    }).catch(err =>  {

      console.log(err);
      this.toastr.error('Something went wrong, report this error through the support feature.', 'Error!',this.options);

    });

    this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev'),viewpoint: "back"}).then(_ => {;

      for (var i = 0; i < this.networkService.returnData.length; i++){

        this.dataBack.push({idreal: this.networkService.returnData[i].ID_UNIT_GOAL, id: this.networkService.returnData[i].ID_SORT, goal: this.networkService.returnData[i].UNIT_GOAL_TITLE,
        status: this.networkService.returnData[i].GOAL_STATUS,date: this.networkService.returnData[i].MOD_TIMESTAMP,
        author: this.networkService.returnData[i].AUTHOR});

      }

    }).then(_ => {;

      this.rowsLookingBack = this.dataBack;
      this.rowsLookingBackReady = true;

    }).catch(err =>  {

      if (this.rowsLookingBack != null){

        console.log(err);
        this.toastr.error('Something went wrong, report this error through the support feature.', 'Error!',this.options);

      }

    });

    this.columnsLookingBack = [
      { prop: 'id', name:'#'},
      { prop: 'goal', name: 'Goal Title'},
      { prop: 'status', name: 'Status'},
      { prop: 'date', name: 'Last Updated'},
      { prop: 'author', name: 'Author'}
    ];

    this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev'),viewpoint: "real"}).then(_ => {;

      for (var i = 0; i < this.networkService.returnData.length; i++){

        this.dataReal.push({idreal: this.networkService.returnData[i].ID_UNIT_GOAL, id: this.networkService.returnData[i].ID_SORT, goal: this.networkService.returnData[i].UNIT_GOAL_TITLE,
        status: this.networkService.returnData[i].GOAL_STATUS,date: this.networkService.returnData[i].MOD_TIMESTAMP,
        author: this.authorTemp});

      }

    }).then(_ => {;

      this.rowsRealTime = this.dataReal;
      this.rowsRealTimeReady = true;

    }).catch(err =>  {

      if (this.rowsRealTime != null){

        console.log(err);
        this.toastr.error('Something went wrong with a table, report this error through the support feature.', 'Error!',this.options);

      }

    });

    this.columnsLookingAhead = [
      { prop: 'id', name:'#'},
      { prop: 'goal', name: 'Goal Title'},
      { prop: 'status', name: 'Status'},
      { prop: 'date', name: 'Last Updated'},
      { prop: 'author', name: 'Author'}
    ];

    this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev'),viewpoint: "ahead"}).then(_ => {;

      for (var i = 0; i < this.networkService.returnData.length; i++){

        this.dataForward.push({idreal: this.networkService.returnData[i].ID_UNIT_GOAL, id: this.networkService.returnData[i].ID_SORT, goal: this.networkService.returnData[i].UNIT_GOAL_TITLE,
        status: this.networkService.returnData[i].GOAL_STATUS,date: this.networkService.returnData[i].MOD_TIMESTAMP,
        author: this.authorTemp});

      }

    }).then(_ => {;

      this.rowsLookingAhead = this.dataForward;
      this.rowsLookingAheadReady = true;

    }).catch(err =>  {

      if (this.rowsLookingAhead != null){

        console.log(err);
        this.toastr.error('Something went wrong with a table, report this error through the support feature.', 'Error!',this.options);

      }

    });

  }

  refreshTables(){

    this.rowsLookingBack = false;
		this.rowsRealTime = false;
		this.rowsLookingAhead = false;

    this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev'),viewpoint: "back"}).then(_ => {;

      this.dataBack = [];

      for (var i = 0; i < this.networkService.returnData.length; i++){

        this.dataBack.push({idreal: this.networkService.returnData[i].ID_UNIT_GOAL, id: this.networkService.returnData[i].ID_SORT, goal: this.networkService.returnData[i].UNIT_GOAL_TITLE,
        status: this.networkService.returnData[i].GOAL_STATUS,date: this.networkService.returnData[i].MOD_TIMESTAMP,
        author: this.authorTemp});

      }

    }).then(_ => {;

      this.rowsLookingBack = this.dataBack;
      this.rowsLookingBackReady = true;

    }).catch(err =>  {

      if (this.rowsLookingBack != null){

        console.log(err);
        this.toastr.error('Something went wrong, report this error through the support feature.', 'Error!',this.options);

      }

    });

    this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev'),viewpoint: "real"}).then(_ => {;

      this.dataReal = [];

      for (var i = 0; i < this.networkService.returnData.length; i++){

        this.dataReal.push({idreal: this.networkService.returnData[i].ID_UNIT_GOAL, id: this.networkService.returnData[i].ID_SORT, goal: this.networkService.returnData[i].UNIT_GOAL_TITLE,
        status: this.networkService.returnData[i].GOAL_STATUS,date: this.networkService.returnData[i].MOD_TIMESTAMP,
        author: this.authorTemp});

      }

    }).then(_ => {;

      this.rowsRealTime = this.dataReal;
      this.rowsRealTimeReady = true;

    }).catch(err =>  {

      if (this.rowsRealTime != null){

        console.log(err);
        this.toastr.error('Something went wrong with a table, report this error through the support feature.', 'Error!',this.options);

      }

    });

    this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev'),viewpoint: "ahead"}).then(_ => {;

      this.dataForward = [];

      for (var i = 0; i < this.networkService.returnData.length; i++){

        this.dataForward.push({idreal: this.networkService.returnData[i].ID_UNIT_GOAL, id: this.networkService.returnData[i].ID_SORT, goal: this.networkService.returnData[i].UNIT_GOAL_TITLE,
        status: this.networkService.returnData[i].GOAL_STATUS,date: this.networkService.returnData[i].MOD_TIMESTAMP,
        author: this.authorTemp});

      }

    }).then(_ => {;

      this.rowsLookingAhead = this.dataForward;
      this.rowsLookingAheadReady = true;

    }).catch(err =>  {

      if (this.rowsLookingAhead != null){

        console.log(err);
        this.toastr.error('Something went wrong with a table, report this error through the support feature.', 'Error!',this.options);

      }

    });

  }

  onDrop(event){

    if (this.buttonsShow){

			this.networkService.post({functionNum: 0, itemdata: event.slice()}).then(_ => {;

				if (this.networkService.returnData == 1){

					this.toastr.success('Table order saved.', 'Save Successful',this.options);
					this.refreshTables();

				}

			}).catch(err =>  {

				console.log(err);
				this.toastr.error('Something went wrong with a table, report this error through the support feature.', 'Error!',this.options);

			});

		}else{

			if (this.warningCounter == 1){

				this.toastr.warning('Your goals have already been submitted, you cannot change the order of the goals.', 'Whoops!',this.options);
				this.warningCounter = 0;

			}

		}

  }

  onDrag(){

    console.log('DRAG event::', event);

  }

  onSelectRow(event): void{

    this.currentGoalID = event.selected[0].idreal;
		this.goalTitleUpdate = event.selected[0].goal;

		this.networkService.post({functionNum: 0, bpyear: this._cacheService.get('bpyear'),ouabbrev: this._cacheService.get('collegeabbrev')
		,goalid: event.selected[0].idreal}).then(_ => {;

			this.updateViewpointOption = this.networkService.returnData[0].GOAL_VIEWPOINT;
			this.goalStatementUpdate = this.networkService.returnData[0].GOAL_STATEMENT;
      this.goalAlignUpdate = this.networkService.returnData[0].GOAL_ALIGNMENT;
      this.goalActionPlanUpdate = this.networkService.returnData[0].GOAL_ACTION_PLAN;
      this.notesUpdate = this.networkService.returnData[0].GOAL_NOTES;

      var uniGoalsTemp = this.networkService.returnData[0].LINK_UNIV_GOAL.split(",");

      for (var i = 0; uniGoalsTemp.length > i; i++){

        if (uniGoalsTemp[i] == 1){

          this.uniGoal1Update = true;

        }

        if(uniGoalsTemp[i] == 2){

          this.uniGoal2Update = true;

        }

        if (uniGoalsTemp[i] == 3){

          this.uniGoal3Update = true;

        }

        if (uniGoalsTemp[i] == 4){

          this.uniGoal4Update = true;

        }

        if (uniGoalsTemp[i] == 5){

          this.uniGoal5Update = true;

        }

      }

		}).catch(err =>  {

			console.log(err);
			this.toastr.error('Something went wrong, report this error through the support feature.', 'Error!',this.options);

		});

		this.show();

	}

  public show(): void {

    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);

  }

  public hide(): void {

    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);

  }

  public onContainerClicked(event: MouseEvent): void {

    if ((<HTMLElement>event.target).classList.contains('modal')) {

      this.hide();

    }

  }

}
