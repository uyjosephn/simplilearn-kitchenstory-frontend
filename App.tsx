import React, { useState } from 'react';
import './App.css';
import { HomePage } from './components/Homepage/Homepage';
import { Footer } from './components/NavbarAndFooter/Footer';
import { Navbar } from './components/NavbarAndFooter/Navbar';
import { SearchFoodPage } from './components/SearchFoodPage/SearchFoodPage';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { FoodCheckoutPage } from './components/FoodCheckout/FoodCheckoutPage';

import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { oktaConfig } from './lib/OktaConfig';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';

import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './components/FoodCheckout/ReviewListPage';
import { ManageLibraryPage } from './components/AdminPage/ManageFoodPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };




  return(
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
          <Navbar/>
          <div className='flex-grow-1'>
            <Switch>
              <Route path='/' exact>
                <Redirect to='/home'/>
              </Route>
              <Route path='/home'>
                <HomePage/>
              </Route>
              <Route path='/search'>
                <SearchFoodPage/>
              </Route>
              <Route path='/checkout/:foodId'>
                <FoodCheckoutPage/>
              </Route>
              <Route path='/reviewlist/:foodId'>
                <ReviewListPage/>
              </Route>
              <SecureRoute path='/admin'>
                <ManageLibraryPage/>
              </SecureRoute>
              <Route path='/login' render={
                () => <LoginWidget config={oktaConfig} /> 
                } 
              />
              
            </Switch>
          </div>
          <Footer/>
          </Security>
    </div>
  );
}
