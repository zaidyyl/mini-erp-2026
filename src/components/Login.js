import { authAPI } from '../services/api.js'
import { TEST_CREDENTIALS } from '../config/api.js'

export class Login {
  constructor() {
    this.container = null
    this.onLoginSuccess = null
  }

  render(container) {
    this.container = container
    this.container.innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Mini ERP
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
              Inicia sesión en tu cuenta
            </p>
          </div>
          <form class="mt-8 space-y-6" id="loginForm">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email" class="sr-only">Email</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autocomplete="email" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                  placeholder="Email"
                  value="admin@minierp.com"
                />
              </div>
              <div>
                <label for="password" class="sr-only">Contraseña</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autocomplete="current-password" 
                  required 
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                  placeholder="Contraseña"
                  value="test123456"
                />
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <span class="text-gray-600">Credenciales de prueba:</span>
                <div class="mt-2 space-y-1">
                  <button type="button" class="block text-blue-600 hover:text-blue-500 text-xs" data-role="admin">
                    Admin: admin@minierp.com
                  </button>
                  <button type="button" class="block text-blue-600 hover:text-blue-500 text-xs" data-role="manager">
                    Manager: manager@minierp.com
                  </button>
                  <button type="button" class="block text-blue-600 hover:text-blue-500 text-xs" data-role="sales">
                    Sales: sales@minierp.com
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button 
                type="submit" 
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                id="loginBtn"
              >
                <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </span>
                Iniciar Sesión
              </button>
            </div>

            <div id="errorMessage" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"></div>
            <div id="successMessage" class="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"></div>
          </form>
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  attachEventListeners() {
    const form = this.container.querySelector('#loginForm')
    const loginBtn = this.container.querySelector('#loginBtn')
    const errorMessage = this.container.querySelector('#errorMessage')
    const successMessage = this.container.querySelector('#successMessage')

    // Quick login buttons
    this.container.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.target.dataset.role
        const credentials = TEST_CREDENTIALS[role]
        
        const emailInput = this.container.querySelector('#email')
        const passwordInput = this.container.querySelector('#password')
        
        emailInput.value = credentials.email
        passwordInput.value = credentials.password
      })
    })

    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      
      const email = form.email.value
      const password = form.password.value

      if (!email || !password) {
        this.showError('Por favor, completa todos los campos')
        return
      }

      try {
        loginBtn.disabled = true
        loginBtn.textContent = 'Iniciando sesión...'
        this.hideMessages()

        const response = await authAPI.login(email, password)
        
        // Store token and user data
        localStorage.setItem('token', response.access_token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        this.showSuccess('¡Login exitoso! Redirigiendo...')
        
        // Call success callback
        if (this.onLoginSuccess) {
          setTimeout(() => {
            this.onLoginSuccess(response.user)
          }, 1000)
        }
        
      } catch (error) {
        console.error('Login error:', error)
        const message = error.response?.data?.detail || 'Error al iniciar sesión'
        this.showError(message)
      } finally {
        loginBtn.disabled = false
        loginBtn.innerHTML = `
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
          </span>
          Iniciar Sesión
        `
      }
    })
  }

  showError(message) {
    const errorMessage = this.container.querySelector('#errorMessage')
    const successMessage = this.container.querySelector('#successMessage')
    
    errorMessage.textContent = message
    errorMessage.classList.remove('hidden')
    successMessage.classList.add('hidden')
  }

  showSuccess(message) {
    const errorMessage = this.container.querySelector('#errorMessage')
    const successMessage = this.container.querySelector('#successMessage')
    
    successMessage.textContent = message
    successMessage.classList.remove('hidden')
    errorMessage.classList.add('hidden')
  }

  hideMessages() {
    const errorMessage = this.container.querySelector('#errorMessage')
    const successMessage = this.container.querySelector('#successMessage')
    
    errorMessage.classList.add('hidden')
    successMessage.classList.add('hidden')
  }
}
