import { Component, Inject, OnInit,ResolvedReflectiveFactory,VERSION } from '@angular/core';
import { FormGroup,FormBuilder,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import {ThemePalette} from '@angular/material/core';
import { MatDialog , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
@Component({
  selector: 'app-create-absence',
  templateUrl: './create-absence.component.html',
  styleUrls: ['./create-absence.component.scss']
})
export class CreateAbsenceComponent implements OnInit {
  color: ThemePalette;
  createAbsForm !: FormGroup;
  fichier: File = null;
  actionBtn :string ="Valider";
  constructor(private formBuilder : FormBuilder ,private router : Router , private api : ApiService, @Inject(MAT_DIALOG_DATA) public editData:any,private dialogRef:MatDialogRef<CreateAbsenceComponent>) { }

  ngOnInit(): void {
    this.createAbsForm = this.formBuilder.group({
      typeAbs: ['',Validators.required],
      Nom:['',Validators.required],
      datePremierJ: ['',Validators.required],
      dateDernierJ: ['',Validators.required],
      dateRetour:['',Validators.required],
      nombreJ:['',Validators.required],
      commentaire:[''],
      file:[''],
      createdDate:new Date(),
      MatinorAprèsMidiPJ:[''],
      MatinorAprèsMidiDJ:['']
    });
    if(this.editData){
      this.actionBtn="Enregistrer";
      this.createAbsForm.controls['typeAbs'].setValue(this.editData.typeAbs);
      this.createAbsForm.controls['Nom'].setValue(this.editData.Nom);
      this.createAbsForm.controls['datePremierJ'].setValue(this.editData.datePremierJ);
      this.createAbsForm.controls['dateDernierJ'].setValue(this.editData.dateDernierJ);
      this.createAbsForm.controls['MatinorAprèsMidiPJ'].setValue(this.editData.MatinorAprèsMidiPJ);
      this.createAbsForm.controls['MatinorAprèsMidiDJ'].setValue(this.editData.MatinorAprèsMidiDJ);
      this.createAbsForm.controls['dateRetour'].setValue(this.editData.dateRetour);
      this.createAbsForm.controls['nombreJ'].setValue(this.editData.nombreJ);
      this.createAbsForm.controls['commentaire'].setValue(this.editData.commentaire);
      this.createAbsForm.controls['file'].setValue(this.editData.file);
      
    }
  }
  envoiFichier (event: Event,) {
    console.log( (event.target as HTMLInputElement) .files)
}
calculerNbJrs(): void {
  let ddebut:any = this.createAbsForm.controls['datePremierJ'].value;
  let dfin:any = this.createAbsForm.controls['dateDernierJ'].value;
  let difference = dfin.getTime() - ddebut.getTime();
  difference = difference / 3600000 //By hours
  difference = difference / 24 //By days


  //Start here
  let selectValue1 = this.createAbsForm.controls['MatinorAprèsMidiPJ'].value;
  let selectValue2 = this.createAbsForm.controls['MatinorAprèsMidiDJ'].value;
  // console.log(selectValue1)
  if(selectValue1 === 'Après-Midi' ) 
  {
    difference=difference - 0.5;
  }
  if ( selectValue2 === 'Après-Midi'){ 
  {
    difference=difference + 0.5;
  }
  }
  //Finish here


  this.createAbsForm.controls['nombreJ'].setValue(difference);
  var dretour = new Date((new Date(dfin.getTime())).valueOf());
  dretour.setDate(dretour.getDate() + 1);
  this.createAbsForm.controls['dateRetour'].setValue(dretour);


}
  CreerAbsence(){
    if(!this.editData){
      if(this.createAbsForm.valid)
    {
      this.api.postAbsence(this.createAbsForm.value)
      .subscribe({
         next:(res) => {
          alert("Absence Créé avec succès!");
          this.createAbsForm.reset();
          this.dialogRef.close('save');
         },
         error:() => {
          alert("Une erreur à été détécter au moment de création d'absence!");
         }
      }),
      this.router.navigateByUrl('/list');
    }
    }else{
      this.updateAbsence();
    }
  }
  updateAbsence(){
    this.api.putAbsence(this.createAbsForm.value,this.editData.id)
    .subscribe({
      next:(res) => {
        alert("Absence modifié avec succès!");
        this.createAbsForm.reset();
        this.dialogRef.close('update');
      },
      error:() =>{
        alert("Erreur lors de la modification d'absence!");
      }
    })
  }

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Primary', completed: false, color: 'primary'},
      {name: 'Accent', completed: false, color: 'accent'},
      {name: 'Warn', completed: false, color: 'warn'},
    ],
  };
}