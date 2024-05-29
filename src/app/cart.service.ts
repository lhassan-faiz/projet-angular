import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './Product';
import { AppUser } from './model/user.model';
import { AuthService } from './auth.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public cartItems$: Observable<Product[]> = this.cartItemsSubject.asObservable();
  private currentUserSubject: BehaviorSubject<AppUser | null> = new BehaviorSubject<AppUser | null>(null);
  public currentUser$: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor(private productService: ProductService, private authService: AuthService) {
    // Mettre à jour le BehaviorSubject currentUserSubject lorsqu'un utilisateur se connecte
    this.authService.currentUser$.subscribe(user => {
      this.currentUserSubject.next(user || null);
    });
  }

  purchase(product: Product): void {
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      this.productService.purchase3(product, currentUser.id);
    } else {
      // Gérer le cas où aucun utilisateur n'est connecté
    }
  }

  addToCart(product: Product): void {
    const currentUser = this.currentUserSubject.getValue();
    if (currentUser) {
      this.productService.addToCart(product, currentUser.id);
    } else {
      // Gérer le cas où aucun utilisateur n'est connecté
    }
  }

  removeFromCart(product: Product): void {
    const currentItems = this.cartItemsSubject.getValue();
    const updatedItems = currentItems.filter(item => item.id !== product.id);
    this.cartItemsSubject.next(updatedItems);
  }

  // Autres méthodes du panier...
}