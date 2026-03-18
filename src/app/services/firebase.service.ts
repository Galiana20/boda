import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore, Firestore, collection, getDocs, addDoc, doc,
  updateDoc, deleteDoc, query, where, orderBy, Timestamp
} from 'firebase/firestore';
import {
  getStorage, FirebaseStorage, ref, uploadBytesResumable,
  getDownloadURL, deleteObject, UploadTaskSnapshot
} from 'firebase/storage';
import { getAuth, Auth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Observable } from 'rxjs';

const firebaseConfig = {
  apiKey: 'AIzaSyCZERNytLaqYUjW41eJBWtixYiREr4g5Rg',
  authDomain: 'boda-eric-lourdes.firebaseapp.com',
  databaseURL: 'https://boda-eric-lourdes-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'boda-eric-lourdes',
  storageBucket: 'boda-eric-lourdes.firebasestorage.app',
  messagingSenderId: '708774889540',
  appId: '1:708774889540:web:5439b39636971d53681411',
  measurementId: 'G-2S0XKGZ8DV'
};

export interface Foto {
  id?: string;
  aprobada: string;
  fechaSubida: Timestamp;
  storagePath: string;
  tamano: string;
  tipo: string;
  url: string;
  nombreOriginal: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
  auth: Auth;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
    this.auth = getAuth(this.app);
  }

  async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut() {
    return signOut(this.auth);
  }

  /** Devuelve todas las fotos aprobadas (para galería pública) */
  async getFotosAprobadas(): Promise<Foto[]> {
    // Filtramos en cliente para evitar requerir índice compuesto en Firestore
    const q = query(collection(this.db, 'FOTOS'), orderBy('fechaSubida', 'desc'));
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Foto))
      .filter(f => f.aprobada === 'true');
  }

  /** Devuelve todas las fotos (para el admin) */
  async getTodasFotos(): Promise<Foto[]> {
    const q = query(collection(this.db, 'FOTOS'), orderBy('fechaSubida', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Foto));
  }

  /** Sube una foto a Storage y crea el documento en Firestore */
  subirFoto(
    file: File,
    autoAprobar: boolean
  ): Observable<{ progress: number; url?: string; docId?: string }> {
    return new Observable(observer => {
      const ext = file.name.split('.').pop() || 'jpg';
      const nombreSanitizado = file.name
        .replace(/\.[^/.]+$/, '')       // quitar extensión
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')     // solo alfanumérico
        .substring(0, 20);              // máx 20 chars
      const timestamp = Date.now();
      const nombreFinal = `${timestamp}_${nombreSanitizado}.${ext}`;
      const storagePath = `fotos/${nombreFinal}`;

      const storageRef = ref(this.storage, storagePath);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        (snap: UploadTaskSnapshot) => {
          const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          observer.next({ progress });
        },
        err => observer.error(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          const foto: Omit<Foto, 'id'> = {
            aprobada: autoAprobar ? 'true' : 'false',
            fechaSubida: Timestamp.now(),
            storagePath,
            tamano: file.size.toString(),
            tipo: file.type,
            url,
            nombreOriginal: nombreFinal
          };
          const docRef = await addDoc(collection(this.db, 'FOTOS'), foto);
          observer.next({ progress: 100, url, docId: docRef.id });
          observer.complete();
        }
      );
    });
  }

  /** Cambia el estado de aprobación de una foto */
  async toggleAprobada(foto: Foto): Promise<void> {
    const nuevoEstado = foto.aprobada === 'true' ? 'false' : 'true';
    await updateDoc(doc(this.db, 'FOTOS', foto.id!), { aprobada: nuevoEstado });
  }

  /** Elimina una foto de Storage y su documento en Firestore */
  async eliminarFoto(foto: Foto): Promise<void> {
    const storageRef = ref(this.storage, foto.storagePath);
    await deleteObject(storageRef);
    await deleteDoc(doc(this.db, 'FOTOS', foto.id!));
  }
}
